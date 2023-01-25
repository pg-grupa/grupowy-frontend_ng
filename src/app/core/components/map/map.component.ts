import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'core-map',
  template: '<div id="map"></div>',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map?: L.Map;

  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.initializeMap();
    this.mapService.mapBounds$.subscribe(console.log);
  }

  private initializeMap(): void {
    this.map = L.map('map', environment.initMapConfig);
    this.map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    );

    this.map.on('moveend', () => {
      this.mapService.onBoundsChanged(this.map!.getBounds());
    });
  }
}
