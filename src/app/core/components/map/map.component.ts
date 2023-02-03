import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-extra-markers';
import { skip, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMapCommand, MapCommandType } from '../../interfaces/map-commands';
import {
  ClickMapEvent,
  MapInitializedEvent,
  MoveEndEvent,
  ZoomEndEvent,
} from '../../interfaces/map-event';
import { IMapState } from '../../interfaces/map-state';
import { ILocation } from '../../models/location';
import { CacheService } from '../../services/cache.service';
import { LoadingService } from '../../services/loading.service';
import { LoggerService } from '../../services/logger.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'core-map',
  template: '<div id="map"></div>',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private _map!: L.Map;
  private _locationsMarkersGroup!: L.FeatureGroup;

  constructor(
    private _mapService: MapService,
    private _logger: LoggerService,
    private _loading: LoadingService,
    private _cache: CacheService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngAfterViewInit(): void {
    this._logger.debug('MapComponent', 'AfterViewInit');
    this._loading.start();

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

    this._initializeMap(config);
    this._loading.stop();
  }

  private _getState(): IMapState {
    return {
      zoom: this._map.getZoom(),
      center: this._map.getCenter(),
      bounds: this._map.getBounds(),
    };
  }

  private _initializeMap(config: any): void {
    this._logger.debug('MapComponent', 'Initializing map.', config);
    this._map = L.map('map', {
      center: [config.lat, config.lng],
      zoom: config.zoom,
      zoomControl: false,
    });
    this._map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    );

    // listen for bounds changes
    this._map.on('moveend', () => {
      this._mapService.onMapEvent(new MoveEndEvent(this._getState()));
    });

    // listen for zoom changes
    this._map.on('zoomend', () => {
      this._mapService.onMapEvent(new ZoomEndEvent(this._getState()));
    });

    // listen for map clicks
    this._map.on('click', (event) => {
      this._mapService.onMapEvent(new ClickMapEvent(event.latlng));
    });

    // initialize markers group
    this._locationsMarkersGroup = new L.FeatureGroup();

    this._logger.debug('MapComponent', 'Map initialized.');
    this._mapService.onMapEvent(
      new MapInitializedEvent({
        zoom: this._map.getZoom(),
        center: this._map.getCenter(),
        bounds: this._map.getBounds(),
      })
    );

    // start listening for commands sent from MapService
    this._mapService.mapCommands$.subscribe((command) =>
      this._handleMapCommand(command)
    );
  }

  private _handleMapCommand(command: IMapCommand) {
    switch (command.type) {
      case MapCommandType.ClearMarkers:
        this._clearMarkers();
        break;
      case MapCommandType.AddLocationsMarkers:
        this._clearMarkers();
        this._addLocationsMarkers(command.payload);
        break;
    }
  }

  private _clearMarkers() {
    this._logger.debug('MapComponent', 'Clearing markers.');
    if (this._map.hasLayer(this._locationsMarkersGroup)) {
      this._locationsMarkersGroup.clearLayers();
      this._map.removeLayer(this._locationsMarkersGroup);
    }
  }

  private _addLocationsMarkers(locations: ILocation[]) {
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
