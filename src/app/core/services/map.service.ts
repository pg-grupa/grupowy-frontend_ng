import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
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
import * as L from 'leaflet';
import 'leaflet-extra-markers';
import 'leaflet.markercluster';
import { CacheService } from './cache.service';
import { LoadingService } from './loading.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _mapEventsSubject: Subject<IMapEvent> = new Subject();
  private _mapStateSubject: ReplaySubject<IMapState> = new ReplaySubject(1);

  private _map!: L.Map;
  private _locationsMarkersGroup!: L.FeatureGroup;
  private _clusterMarkersGroup!: L.MarkerClusterGroup;

  public readonly mapEvents$ = this._mapEventsSubject.asObservable();
  public readonly mapState$ = this._mapStateSubject.asObservable();

  constructor(
    private _logger: LoggerService,
    private _cache: CacheService,
    private _loading: LoadingService
  ) {
    this._logger.debug('MapService', 'Instantiated.');
  }

  initializeService(): void {
    this._loading.start();
    this._logger.debug('MapService', 'Initializing service.');

    this._initMap();
    this._initEvents();

    this._logger.debug('MapService', 'Service initialized.');
    this._onMapEvent(
      new MapInitializedEvent({
        zoom: this._map.getZoom(),
        center: this._map.getCenter(),
        bounds: this._map.getBounds(),
      })
    );
    this._loading.stop();
  }

  private _getInitialConfig() {
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

    if (isNaN(config.lat) || isNaN(config.lng) || isNaN(config.zoom)) {
      this._logger.error(
        'MapComponent',
        'Error parsing initial query params.',
        config
      );
      config = environment.initMapConfig;
    }
    this._logger.debug('MapService', 'Initial config:', config);
    return config;
  }

  private _initMap(): void {
    const config = this._getInitialConfig();

    this._map = L.map('map', {
      center: [config.lat, config.lng],
      zoom: config.zoom,
      zoomControl: false,
    });
    this._map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    );

    // initialize markers group
    this._locationsMarkersGroup = new L.FeatureGroup();
    this._clusterMarkersGroup = new L.MarkerClusterGroup();

    this._logger.debug('MapService', 'Map initialized.');
  }

  private _initEvents(): void {
    // listen for bounds changes
    this._map.on('moveend', () => {
      this._onMapEvent(new MoveEndEvent(this._getState()));
    });

    // listen for zoom changes
    this._map.on('zoomend', () => {
      this._onMapEvent(new ZoomEndEvent(this._getState()));
    });

    // listen for map clicks
    this._map.on('click', (event) => {
      this._onMapEvent(new ClickMapEvent(event.latlng));
    });
    this._logger.debug('MapService', 'Map events initialized.');
  }

  private _onMapStateChange(mapState: IMapState) {
    this._logger.debug('MapService', 'Map state changed:', mapState);
    this._mapStateSubject.next(mapState);
  }

  private _onMapEvent(mapEvent: IMapEvent): void {
    // this._logger.debug(
    //   'MapService',
    //   `Map event: ${MapEventType[mapEvent.type]}`,
    //   mapEvent
    // );
    this._mapEventsSubject.next(mapEvent);
    if ('state' in mapEvent) {
      this._onMapStateChange(mapEvent.state!);
    }
  }

  private _getState(): IMapState {
    return {
      zoom: this._map.getZoom(),
      center: this._map.getCenter(),
      bounds: this._map.getBounds(),
    };
  }

  private _getMarkersMode(): 'none' | 'marker' | 'cluster' {
    const zoom = this._getState().zoom;
    const configs = environment.markersConfig;

    for (let index = 0; index < configs.length; index++) {
      const config = configs[index];
      if (zoom >= config.minZoom && zoom <= config.maxZoom) return config.mode;
    }
    this._logger.error(
      'MapService',
      `Improperly configured - couldn't specify markers mode for zoom: ${zoom}`
    );
    return 'none';
  }

  drawLocationsMarkers(
    locations: ILocation[],
    enforceDrawingMode?: 'marker' | 'cluster'
  ) {
    // locations = this._limitLocationsMarkers(locations, aboveLimitBehavior);
    this.clearMarkers();
    // this._logger.debug('MapService', 'Drawing markers.', locations);
    let mode: string;
    if (enforceDrawingMode) {
      mode = enforceDrawingMode;
    } else {
      mode = this._getMarkersMode();
    }
    this._logger.debug('MapService', `Drawing mode: ${mode}`);
    let targetLayer: L.LayerGroup;
    switch (mode) {
      case 'marker':
        targetLayer = this._locationsMarkersGroup;
        break;
      case 'cluster':
        targetLayer = this._clusterMarkersGroup;
        break;
      case 'none':
        return;
      default:
        targetLayer = this._locationsMarkersGroup;
    }

    locations.forEach((location) => {
      const iconName = this._cache.getLocationType(
        location.type as number
      )?.icon;
      const icon = new L.ExtraMarkers.Icon({
        icon: iconName,
        markerColor: 'cyan',
        prefix: 'fa',
      });
      const marker = L.marker([location.latitude, location.longitude], {
        icon: icon,
      });
      marker.bindTooltip(location.name, {
        offset: [15, -22.5],
      });
      // marker.addTo(this._locationsMarkersGroup);
      marker.addTo(targetLayer);
      // marker.on('click', () => {
      //   placeService.selectPlace(place);
      // });
    });
    if (!this._map.hasLayer(targetLayer)) this._map.addLayer(targetLayer);
  }

  clearMarkers() {
    this._logger.debug('MapService', 'Clearing markers.');
    if (this._map.hasLayer(this._locationsMarkersGroup)) {
      this._locationsMarkersGroup.clearLayers();
      this._map.removeLayer(this._locationsMarkersGroup);
    }
    if (this._map.hasLayer(this._clusterMarkersGroup)) {
      this._clusterMarkersGroup.clearLayers();
      this._map.removeLayer(this._clusterMarkersGroup);
    }
  }
}
