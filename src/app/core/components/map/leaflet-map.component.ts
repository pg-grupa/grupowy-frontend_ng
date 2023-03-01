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
import { MapService } from 'src/app/core/services/map.service';
import { LayerGroupService } from '../../services/layer-group.service';

@Component({
  selector: 'core-map[center][zoom]',
  template: `<div #mapContainer id="mapContainer"></div>`,
  styles: [
    `
      #mapContainer {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  providers: [
    MapService,
    { provide: LayerGroupService, useExisting: MapService },
  ],
})
export class LeafletMapComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private _map!: L.Map;

  /**
   * Center of the map. For map to detect changes, new object reference must be passed,
   * i.e. new {@link L.LatLng} object must be created.
   *
   * For animated transition, see {@link MapComponent.flyTo}.
   */
  @Input() center!: L.LatLng;
  @Output() centerChange = new EventEmitter<L.LatLng>();

  /**
   * Zoom of the map.
   *
   * For animated transition, see {@link MapComponent.flyTo}.
   */
  @Input() zoom!: number;
  @Output() zoomChange = new EventEmitter<number>();

  @Input() mapOptions: L.MapOptions = {
    zoomControl: false,
  };

  /** Emits new map {@link L.LatLngBounds} on moveend event. */
  @Output() moveend = new EventEmitter<L.LatLngBounds>();
  /** Triggers on movestart event. */
  @Output() movestart = new EventEmitter<void>();
  /** Emits {@link L.LatLng} of left click. */
  @Output() leftClick = new EventEmitter<L.LatLng>();
  /** Emits {@link L.LatLng} of right click. */
  @Output() rightClick = new EventEmitter<L.LatLng>();

  constructor(private _mapService: MapService) {}

  ngAfterViewInit() {
    this._map = new L.Map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      ...this.mapOptions,
    });

    this._map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'map-tiles',
        updateWhenIdle: false,
      })
    );

    // * INITIALIZE EVENTS
    this._map.on('zoomend', (event) => {
      this.zoom = this._map.getZoom();
      this.zoomChange.emit(this.zoom);
      // zooming also fires the moveend event, new bounds are emitted in moveend handle
    });

    this._map.on('moveend', (event) => {
      this.center = this._map.getCenter();
      this.centerChange.emit(this.center);
      this.moveend.emit(this._map.getBounds());
    });

    this._map.on('movestart', (event) => {
      this.movestart.emit();
    });

    this._map.on('click', (event) => {
      this.leftClick.emit(event.latlng);
    });

    this._map.on('contextmenu', (event) => {
      this.rightClick.emit(event.latlng);
    });

    // * INITIALIZE SERVICE
    this._mapService.initMap(this._map);

    // emit map bounds after initialization
    this.moveend.emit(this._map.getBounds());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._map) return;

    if ('center' in changes) {
      this._handleCenterChange(changes['center'].currentValue);
    }

    if ('zoom' in changes) {
      this._handleZoomChange(changes['zoom'].currentValue);
    }
  }

  private _handleCenterChange(center: L.LatLng): void {
    if (!this._map.getCenter().equals(center)) {
      this._map.setView(center, undefined, { animate: false });
    }
  }

  private _handleZoomChange(zoom: number): void {
    if (zoom !== this._map.getZoom()) {
      this._map.setZoom(zoom, { animate: false });
    }
  }

  setView(center: L.LatLng, zoom?: number, options?: L.ZoomPanOptions): void {
    this._map.setView(center, zoom, { animate: false, ...options });
  }

  flyTo(center: L.LatLng, zoom?: number, options?: L.ZoomPanOptions): void {
    this._map.flyTo(center, zoom, options);
  }

  flyToBounds(bounds: L.LatLngBounds, options?: L.FitBoundsOptions) {
    this._map.flyToBounds(bounds, options);
  }
}
