import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/core/components/map/map.service';

@Component({
  selector: 'leaflet-map[center]',
  template: '<div #mapContainer></div>',
  styleUrls: ['./map.component.scss'],
  providers: [MapService],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private _map!: L.Map;

  @Input() center!: L.LatLngExpression;
  @Output() centerChange = new EventEmitter<L.LatLngExpression>();

  @Input() zoom: number = 14;
  @Output() zoomChange = new EventEmitter<number>();

  @Output() nativeEvent = new EventEmitter<L.LeafletEvent>();

  constructor(private _mapService: MapService) {}

  ngAfterViewInit(): void {
    const mapContainer = this.mapContainer.nativeElement;
    this._map = L.map(mapContainer, {
      center: this.center,
      zoom: this.zoom,
      zoomControl: false,
    });
    this._map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'map-tiles',
      })
    );
    this._mapService.initMap(this._map);
  }
}
