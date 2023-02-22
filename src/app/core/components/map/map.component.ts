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
      zoom: undefined,
    };

    if ('center' in changes) {
      const currentValue = changes['center'].currentValue;

      if (!this._map.getCenter().equals(currentValue)) {
        flyTo.latlng = changes['center'].currentValue;
      }
    }

    if ('zoom' in changes) {
      const currentValue = changes['zoom'].currentValue;
      if (currentValue !== this._map.getZoom()) {
        flyTo.zoom = changes['zoom'].currentValue;
      }
    }

    if (flyTo.latlng) {
      this._map.flyTo(flyTo.latlng, flyTo.zoom);
      return;
    }

    if (flyTo.zoom) {
      this._map.setZoom(flyTo.zoom);
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
    this._map.on('zoomend', (event) => {
      this._onZoomEnd(event);
    });

    this._map.on('moveend', (event) => {
      this._onMoveEnd(event);
    });
  }

  private _onZoomEnd(event: L.LeafletEvent): void {
    this.zoom = this._map.getZoom();
    this.zoomChange.emit(this.zoom);
    // zooming also fires the moveend event, new bounds are emitted in _onMoveEnd
    // this.boundsChange.emit(this._map.getBounds());
  }

  private _onMoveEnd(event: L.LeafletEvent): void {
    this.center = this._map.getCenter();
    this.centerChange.emit(this.center);
    this.boundsChange.emit(this._map.getBounds());
  }
}
