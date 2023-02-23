import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/core/components/map/map.service';
import { MapMode } from '../../enums/settings';

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

  @Output() leftClick = new EventEmitter<L.LatLng>();
  @Output() rightClick = new EventEmitter<L.LatLng>();

  @Input() forceMode?: MapMode;
  @Input() flyTo?: [L.LatLng, number];
  @Input() setView?: [L.LatLng, number];

  constructor(private _mapService: MapService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._map) return;

    // if ('center' in changes) {
    //   this._handleCenterChange(changes['center']);
    // }

    // if ('zoom' in changes) {
    //   this._handleZoomChange(changes['zoom']);
    // }

    if ('flyTo' in changes) {
      this._handleFlyToChange(changes['flyTo']);
    }

    if ('setView' in changes) {
      this._handleSetViewChange(changes['setView']);
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
    this._mapService.initMap(this._map, this.forceMode);
    this._initEvents();
    this.boundsChange.emit(this._map.getBounds());
  }

  private _initEvents(): void {
    this._map.on('zoomend', (event) => {
      this.zoomChange.emit(this._map.getZoom());
      // zooming also fires the moveend event, new bounds are emitted in moveend handle
      // this.boundsChange.emit(this._map.getBounds());
    });

    this._map.on('moveend', (event) => {
      this.centerChange.emit(this._map.getCenter());
      this.boundsChange.emit(this._map.getBounds());
    });

    this._map.on('click', (event) => {
      this.leftClick.emit(event.latlng);
    });

    this._map.on('contextmenu', (event) => {
      this.rightClick.emit(event.latlng);
    });
  }

  private _handleCenterChange(change: SimpleChange): void {
    const currentValue = change.currentValue;

    if (!this._map.getCenter().equals(currentValue)) {
      this._map.setView(currentValue, undefined, { animate: false });
    }
  }

  private _handleZoomChange(change: SimpleChange): void {
    const currentValue = change.currentValue;
    if (currentValue !== this._map.getZoom()) {
      this._map.setZoom(currentValue, { animate: false });
    }
  }

  private _handleSetViewChange(change: SimpleChange): void {
    const currentValue = change.currentValue as [L.LatLng, number] | undefined;
    if (currentValue === undefined) return;
    const center = currentValue[0];
    const zoom = currentValue[1];
    if (!this._map.getCenter().equals(center) || this._map.getZoom() !== zoom) {
      this._map.setView(center, zoom, { animate: false });
    }
  }

  private _handleFlyToChange(change: SimpleChange): void {
    const currentValue = change.currentValue as [L.LatLng, number] | undefined;
    if (currentValue === undefined) return;

    const options: L.FitBoundsOptions = {
      paddingBottomRight: [window.innerWidth / 3, window.innerHeight / 1.5],
      paddingTopLeft: [window.innerWidth / 3, window.innerHeight / 4],
      maxZoom: currentValue[1],
    };
    this._map.fitBounds(
      new L.LatLngBounds(currentValue[0], currentValue[0]),
      options
    );
  }
}
