import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';
import {
  ClickMapEvent,
  MoveEndEvent,
  ZoomEndEvent,
} from '../../interfaces/map-event';
import { LoggerService } from '../../services/logger.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'core-map',
  template: '<div id="map"></div>',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;

  constructor(private mapService: MapService, private _logger: LoggerService) {}

  ngAfterViewInit(): void {
    this.initializeMap();
    this.mapService.newMapEvent(new MoveEndEvent(this.map.getBounds()));
  }

  private initializeMap(): void {
    this._logger.debug(
      'MapComponent',
      'Initializing map.',
      environment.initMapConfig
    );
    this.map = L.map('map', environment.initMapConfig);
    this.map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    );

    // listen for bounds changes
    this.map.on('moveend', () => {
      this.mapService.newMapEvent(new MoveEndEvent(this.map.getBounds()));
    });

    // listen for zoom changes
    this.map.on('zoomend', () => {
      this.mapService.newMapEvent(new ZoomEndEvent(this.map.getZoom()));
    });

    // listen for map clicks
    this.map.on('click', (event) => {
      this.mapService.newMapEvent(new ClickMapEvent(event.latlng));
    });
    this._logger.debug('MapComponent', 'Map initialized.');
  }
}
