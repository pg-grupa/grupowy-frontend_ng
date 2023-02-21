import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
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
export class MapComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private _map!: L.Map;

  @Input() center!: L.LatLng;
  @Output() centerChange = new EventEmitter<L.LatLng>();

  @Input() zoom: number = 14;
  @Output() zoomChange = new EventEmitter<number>();

  @Output() mapEvent = new EventEmitter<L.LeafletEvent>();
  @Output() boundsChange = new EventEmitter<L.LatLngBounds>();

  constructor(private _mapService: MapService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._map) return;

    let flyTo = {
      latlng: undefined,
      zoom: this.zoom,
    };

    if ('center' in changes) {
      if (
        !changes['center'].currentValue.equals(changes['center'].previousValue)
      ) {
        flyTo.latlng = changes['center'].currentValue;
      }
    }

    if ('zoom' in changes) {
      flyTo.zoom = changes['zoom'].currentValue;
    }

    if (flyTo.latlng) {
      this._map.flyTo(flyTo.latlng, flyTo.zoom);
    }
  }

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
    this._initEvents();
    this.boundsChange.emit(this._map.getBounds());
  }

  private _initEvents(): void {
    // this._map.on('zoomend', (event) => {
    //   this.zoomChange.emit(this._map.getZoom());
    //   this.boundsChange.emit(this._map.getBounds());
    //   this.centerChange.emit(this._map.getCenter());
    //   this.mapEvent.emit(event);
    // });

    this._map.on('moveend', (event) => {
      this.centerChange.emit(this._map.getCenter());
      this.zoomChange.emit(this._map.getZoom());
      this.boundsChange.emit(this._map.getBounds());
      this.mapEvent.emit(event);
    });
  }
}
