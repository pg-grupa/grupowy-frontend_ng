import { Injectable } from '@angular/core';
import { filter, ReplaySubject, Subject, take, tap } from 'rxjs';
import {
  ClickMapEvent,
  IMapEvent,
  MapEventType,
  MapInitializedEvent,
  MoveEndEvent,
  ZoomEndEvent,
} from '../interfaces/map-event';
import { IMapState } from '../interfaces/map-state';
import { ILocation } from '../models/location';
import { LoggerService } from './logger.service';
import { CacheService } from './cache.service';
import { LoadingService } from './loading.service';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';
import 'leaflet-extra-markers';
import 'leaflet.markercluster';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

/**
 * Service responsible for managing map component
 * and communication with other elements
 */
@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _mapEventsSubject: Subject<IMapEvent> = new Subject();
  private _mapStateSubject: ReplaySubject<IMapState> = new ReplaySubject(1);

  private _updateLocation: boolean = false;

  private _map!: L.Map;

  private _layers = {
    /** Map layer containing locations markers. */
    markers: new L.FeatureGroup(),
    /** Map layer containing markers clusters. */
    clusters: new L.MarkerClusterGroup(),
  };

  /** Observable of map events. Emits {@link IMapEvent} */
  public readonly mapEvents$ = this._mapEventsSubject.asObservable();
  /** Observable of map state. Emits {@link IMapState} */
  public readonly mapState$ = this._mapStateSubject.asObservable();

  constructor(
    private _logger: LoggerService,
    private _cache: CacheService,
    private _loading: LoadingService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  /**
   * Initialize service, needs to be called once, after {@link MapComponent}
   * finished initializing.
   */
  initializeService(): void {
    this._loading.start();

    this._initMap();
    this._initEvents();

    this._onMapEvent(
      new MapInitializedEvent({
        zoom: this._map.getZoom(),
        center: this._map.getCenter(),
        bounds: this._map.getBounds(),
      })
    );

    // Wait for navigation end, before updating window location with map state.
    // route.queryParamMap emits empty object until NavigationEnd event is fired,
    // if router.navigate is called before NavigationEnd event, all query parameters
    // are overwritten (even if queryParamsHandling set to 'merge'). Need to wait
    // for queryParamMap to be populated with actual values, so they can be preserved
    // on navigation.
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        this._updateLocation = true;
        this._onMapStateChange(this.getState());
      });

    this._loading.stop();
  }

  /**
   * Creates initial map configuration, gets settings from query params if present,
   * form environment file otherwise.
   */
  private _getInitialConfig() {
    // check query params for initial config
    const url = new URL(window.location.href);
    const params = url.searchParams;

    let config = { ...environment.initMapConfig };
    if (params.has('lat')) {
      config.lat = +params.get('lat')!;
    }
    if (params.has('lng')) {
      config.lng = +params.get('lng')!;
    }
    if (params.has('zoom')) {
      config.zoom = +params.get('zoom')!;
    }

    // if any of the variables is not a number
    // returns config to default value from environment file
    if (isNaN(config.lat) || isNaN(config.lng) || isNaN(config.zoom)) {
      this._logger.warn(
        'MapComponent',
        'Error parsing initial query params.',
        config
      );
      config = environment.initMapConfig;
    }
    return config;
  }

  /**
   * Initialize {@link _map} with {@link L.Map} object.
   */
  private _initMap(): void {
    const config = this._getInitialConfig();

    this._map = L.map('map', {
      center: [config.lat, config.lng],
      zoom: config.zoom,
      zoomControl: false,
    });
    this._map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'map-tiles',
      })
    );
  }

  /**
   * Initialize map events listeners.
   */
  private _initEvents(): void {
    // listen for bounds changes
    this._map.on('moveend', () => {
      this._onMapEvent(new MoveEndEvent(this.getState()));
    });

    // listen for zoom changes
    this._map.on('zoomend', () => {
      this._onMapEvent(new ZoomEndEvent(this.getState()));
    });

    // listen for map clicks
    this._map.on('click', (event) => {
      this._onMapEvent(new ClickMapEvent(event.latlng));
    });
  }

  /**
   * Emit new map state on {@link MoveEndEvent} and {@link ZoomEndEvent} events,
   * change current query params.
   * @param {IMapState} mapState
   */
  private _onMapStateChange(mapState: IMapState) {
    const params = {
      lat: mapState.center.lat,
      lng: mapState.center.lng,
      zoom: mapState.zoom,
    };
    if (this._updateLocation)
      this._router.navigate([], {
        relativeTo: this._route,
        replaceUrl: true,
        queryParams: params,
        queryParamsHandling: 'merge',
      });
    this._mapStateSubject.next(mapState);
  }

  /**
   * Handle map events.
   */
  private _onMapEvent(mapEvent: IMapEvent): void {
    this._mapEventsSubject.next(mapEvent);

    // if map state changed, emit new one
    if ('state' in mapEvent) {
      this._onMapStateChange(mapEvent.state!);
    }
  }

  /**
   * Returns current map state.
   * @return {IMapState}
   */
  getState(): IMapState {
    return {
      zoom: this._map.getZoom(),
      center: this._map.getCenter(),
      bounds: this._map.getBounds(),
    };
  }

  /**
   * Returns if/how should markers be drawn on the map,
   * depending on current map zoom and configuration from environment file.
   * - 'none' - markers shouldn't be drawn
   * - 'marker' - each marker drawn separately
   * - 'cluster' - markers shoul be drawn in clusters
   */
  private _getMarkersMode(): 'none' | 'marker' | 'cluster' {
    const zoom = this.getState().zoom;
    const configs = environment.markersConfig;

    // check config for proper mode
    for (let index = 0; index < configs.length; index++) {
      const config = configs[index];
      if (zoom >= config.minZoom && zoom <= config.maxZoom) return config.mode;
    }

    // if proper config not found
    this._logger.error(
      'MapService',
      `Improperly configured - couldn't specify markers mode for zoom: ${zoom}`
    );
    return 'none';
  }

  /**
   * Draw markers for provided locations.
   * Drawing mode is specified by {@link _getMarkersMode}, but can be enforced
   * by providing enforceDrawingMode param.
   */
  drawLocationsMarkers(
    locations: ILocation[],
    enforceDrawingMode?: 'marker' | 'cluster'
  ) {
    // clear markers before drawing new ones
    this.clearMarkers();

    // set drawing mode
    let mode: string;
    if (enforceDrawingMode) {
      mode = enforceDrawingMode;
    } else {
      mode = this._getMarkersMode();
    }

    // set target layer - markers/cluster
    let targetLayer: L.LayerGroup;
    switch (mode) {
      case 'marker':
        targetLayer = this._layers['markers'];
        break;
      case 'cluster':
        targetLayer = this._layers['clusters'];
        break;
      case 'none':
        return; // exit function without drawing
      default:
        targetLayer = this._layers['markers'];
    }

    // generate and add markers to the layer for each location
    locations.forEach((location) => {
      // get icon css class
      const iconName = this._cache.getLocationType(
        location.type as number
      )?.icon;
      // create icon
      const icon = new L.ExtraMarkers.Icon({
        icon: iconName,
        markerColor: 'cyan',
        prefix: 'fa',
      });

      // create marker
      const marker = L.marker([location.latitude, location.longitude], {
        icon: icon,
      });
      marker.bindTooltip(location.name, {
        offset: [15, -22.5],
      });
      marker.addTo(targetLayer);

      // TODO: add event listeners for marker click
      marker.on('click', () => {
        this._router.navigate(['/', 'search', 'details', location.id], {
          queryParamsHandling: 'preserve',
        });
      });
    });

    // add markers layer to the map
    if (!this._map.hasLayer(targetLayer)) this._map.addLayer(targetLayer);
  }

  /** Clear markers from the map */
  clearMarkers() {
    // this._logger.debug('MapService', 'Clearing markers.');
    // if (this._map.hasLayer(this._layers.markers)) {
    //   this._layers.markers.clearLayers();
    //   this._map.removeLayer(this._layers.markers);
    // }
    // if (this._map.hasLayer(this._layers.clusters)) {
    //   this._layers.clusters.clearLayers();
    //   this._map.removeLayer(this._layers.clusters);
    // }
    this.hideLayers('markers', 'clusters');
    this.clearLayers('markers', 'clusters');
  }

  hideLayers(...layers: (keyof typeof this._layers)[]) {
    layers.forEach((layer) => {
      if (this._map.hasLayer(this._layers[layer])) {
        this._map.removeLayer(this._layers[layer]);
      }
    });
  }

  showLayers(...layers: (keyof typeof this._layers)[]) {
    layers.forEach((layer) => {
      if (!this._map.hasLayer(this._layers[layer])) {
        this._map.addLayer(this._layers[layer]);
      }
    });
  }

  clearLayers(...layers: (keyof typeof this._layers)[]) {
    layers.forEach((layer) => {
      this._layers[layer].clearLayers();
    });
  }

  flyTo(latitude: number, longitude: number, zoom?: number) {
    this._map.flyTo([latitude, longitude], zoom);
  }
}
