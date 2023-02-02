import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { skip, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ClickMapEvent,
  MapInitializedEvent,
  MoveEndEvent,
  ZoomEndEvent,
} from '../../interfaces/map-event';
import { IMapState } from '../../interfaces/map-state';
import { LoadingService } from '../../services/loading.service';
import { LoggerService } from '../../services/logger.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'core-map',
  template: '<div id="map"></div>',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;

  constructor(
    private _mapService: MapService,
    private _logger: LoggerService,
    private _loading: LoadingService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngAfterViewInit(): void {
    this._loading.start();
    this._route.queryParamMap.pipe(skip(1), take(1)).subscribe((params) => {
      let config = environment.initMapConfig;
      if (params.has('lat')) {
        config.lat = +params.get('lat')!;
      }
      if (params.has('lng')) {
        config.lng = +params.get('lng')!;
      }
      if (params.has('zoom')) {
        config.zoom = +params.get('zoom')!;
      }
      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: config,
        queryParamsHandling: 'merge',
        skipLocationChange: true,
      });
      this._initializeMap(config);
      this._loading.stop();
    });
  }

  private _getState(): IMapState {
    return {
      zoom: this.map.getZoom(),
      center: this.map.getCenter(),
      bounds: this.map.getBounds(),
    };
  }

  private _initializeMap(config: any): void {
    this._logger.debug('MapComponent', 'Initializing map.', config);
    this.map = L.map('map', {
      center: [config.lat, config.lng],
      zoom: config.zoom,
      zoomControl: false,
    });
    this.map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    );

    // listen for bounds changes
    this.map.on('moveend', () => {
      this._mapService.onMapEvent(new MoveEndEvent(this._getState()));
    });

    // listen for zoom changes
    this.map.on('zoomend', () => {
      this._mapService.onMapEvent(new ZoomEndEvent(this._getState()));
    });

    // listen for map clicks
    this.map.on('click', (event) => {
      this._mapService.onMapEvent(new ClickMapEvent(event.latlng));
    });
    this._logger.debug('MapComponent', 'Map initialized.');
    this._mapService.onMapEvent(
      new MapInitializedEvent({
        zoom: this.map.getZoom(),
        center: this.map.getCenter(),
        bounds: this.map.getBounds(),
      })
    );
  }
}
