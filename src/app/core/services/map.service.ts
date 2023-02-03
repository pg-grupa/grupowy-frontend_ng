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

  public readonly mapEvents$ = this._mapEventsSubject.asObservable();
  public readonly mapState$ = this._mapStateSubject.asObservable();

  constructor(
    private _logger: LoggerService,
    private _cache: CacheService,
    private _loading: LoadingService
  ) {
    this._logger.debug('MapService', 'Instantiated.');
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

    this._logger.debug('MapService', 'Map initialized.');
  }

  private _initEvents(): void {
    // listen for bounds changes
    this._map.on('moveend', () => {
      this.onMapEvent(new MoveEndEvent(this._getState()));
    });

    // listen for zoom changes
    this._map.on('zoomend', () => {
      this.onMapEvent(new ZoomEndEvent(this._getState()));
    });

    // listen for map clicks
    this._map.on('click', (event) => {
      this.onMapEvent(new ClickMapEvent(event.latlng));
    });
    this._logger.debug('MapService', 'Map events initialized.');
  }

  initializeService(): void {
    this._loading.start();
    this._logger.debug('MapService', 'Initializing service.');

    this._initMap();
    this._initEvents();

    this._logger.debug('MapService', 'Service initialized.');
    this.onMapEvent(
      new MapInitializedEvent({
        zoom: this._map.getZoom(),
        center: this._map.getCenter(),
        bounds: this._map.getBounds(),
      })
    );
    this._loading.stop();
  }

  onMapStateChange(mapState: IMapState) {
    this._logger.debug('MapService', 'Map state changed:', mapState);
    this._mapStateSubject.next(mapState);
  }

  onMapEvent(mapEvent: IMapEvent): void {
    // this._logger.debug(
    //   'MapService',
    //   `Map event: ${MapEventType[mapEvent.type]}`,
    //   mapEvent
    // );
    this._mapEventsSubject.next(mapEvent);
    if ('state' in mapEvent) {
      this.onMapStateChange(mapEvent.state!);
    }
  }

  private _getState(): IMapState {
    return {
      zoom: this._map.getZoom(),
      center: this._map.getCenter(),
      bounds: this._map.getBounds(),
    };
  }

  public clearMarkers() {
    this._logger.debug('MapService', 'Clearing markers.');
    if (this._map.hasLayer(this._locationsMarkersGroup)) {
      this._locationsMarkersGroup.clearLayers();
      this._map.removeLayer(this._locationsMarkersGroup);
    }
  }

  private _limitLocationsMarkers(
    locations: ILocation[],
    aboveLimitBehavior: 'cut' | 'draw' | 'clear'
  ) {
    const limit = environment.markersConfig.maxAmount;
    if (locations.length > limit) {
      switch (aboveLimitBehavior) {
        case 'cut':
          this._logger.warn(
            'MapService',
            `Drawing ${limit} markers, ${locations.length - limit} omitted.`
          );
          locations.splice(limit);
          return locations;
        case 'clear':
          this._logger.warn(
            'MapService',
            'Locations number exceeded limit. Clearing map.'
          );
          return [];
        default:
          this._logger.warn(
            'MapService',
            `Drawing ${locations.length} markers, ${
              locations.length - limit
            } above limit. App may work slowly.`
          );
      }
    }
    return locations;
  }

  public drawLocationsMarkers(
    locations: ILocation[],
    aboveLimitBehavior: 'cut' | 'draw' | 'clear' = 'clear'
  ) {
    locations = this._limitLocationsMarkers(locations, aboveLimitBehavior);
    this.clearMarkers();
    // this._logger.debug('MapService', 'Drawing markers.', locations);
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
      marker.addTo(this._locationsMarkersGroup);
      // marker.on('click', () => {
      //   placeService.selectPlace(place);
      // });
    });
    if (!this._map.hasLayer(this._locationsMarkersGroup))
      this._map.addLayer(this._locationsMarkersGroup);
  }
}
