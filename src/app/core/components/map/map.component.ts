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
import { MapMode } from '../../enums/settings';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'leaflet-map[center]',
  template: '<div #mapContainer></div>',
  styleUrls: ['./map.component.scss'],
  providers: [MapService],
})
export class MapComponent implements AfterViewInit, OnChanges {
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
  @Input() zoom: number = 14;
  @Output() zoomChange = new EventEmitter<number>();

  /** Emits new map {@link L.LatLngBounds} on moveend event. */
  @Output() boundsChange = new EventEmitter<L.LatLngBounds>();

  /** Emits {@link L.LatLng} of left click. */
  @Output() leftClick = new EventEmitter<L.LatLng>();
  /** Emits {@link L.LatLng} of left click. */
  @Output() rightClick = new EventEmitter<L.LatLng>();

  /**
   * Enforce markers drawing mode, otherwise use {@link SettingsService.mapMode$}.
   *
   * TODO: listen to changes and update {@link MapService} accordingly.
   */
  @Input() forceMode?: MapMode;

  /**
   * Set map view to provided center and zoom with animated transition.
   *
   * @see {@link setView}, {@link zoom}, {@link center} for instant transition.
   * @see {@link _handleFlyToChange}
   */
  @Input() flyTo?: { latLng: L.LatLng; zoom: number };

  /**
   * Set map view to provided center and zoom. Not animated.
   *
   * @see {@link flyTo} for animated transition.
   * @see {@link _handleSetViewChange}
   */
  @Input() setView?: { latLng: L.LatLng; zoom: number };

  constructor(private _mapService: MapService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._map) return;

    if ('center' in changes) {
      this._handleCenterChange(changes['center'].currentValue);
    }

    if ('zoom' in changes) {
      this._handleZoomChange(changes['zoom'].currentValue);
    }

    if ('flyTo' in changes) {
      this._handleFlyToChange(changes['flyTo'].currentValue);
    }

    if ('setView' in changes) {
      this._handleSetViewChange(changes['setView'].currentValue);
    }
  }

  ngAfterViewInit(): void {
    // initialize map
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

    // initialize map service
    this._mapService.initMap(this._map, this.forceMode);

    // initialize map events
    this._initEvents();

    // emit map bounds after initialization
    this.boundsChange.emit(this._map.getBounds());
  }

  private _initEvents(): void {
    this._map.on('zoomend', (event) => {
      this.zoom = this._map.getZoom();
      this.zoomChange.emit(this.zoom);
      // zooming also fires the moveend event, new bounds are emitted in moveend handle
      // this.boundsChange.emit(this._map.getBounds());
    });

    this._map.on('moveend', (event) => {
      this.center = this._map.getCenter();
      this.centerChange.emit(this.center);
      this.boundsChange.emit(this._map.getBounds());
    });

    this._map.on('click', (event) => {
      this.leftClick.emit(event.latlng);
    });

    this._map.on('contextmenu', (event) => {
      this.rightClick.emit(event.latlng);
    });
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

  /**
   * Set map view to provided center and zoom. Not animated.
   * @see {@link flyTo} and {@link _handleFlyToChange} for animated transition.
   */
  private _handleSetViewChange(
    setView: { latLng: L.LatLng; zoom: number } | undefined
  ): void {
    if (setView === undefined) return;
    const center = setView.latLng;
    const zoom = setView.zoom;
    if (!this._map.getCenter().equals(center) || this._map.getZoom() !== zoom) {
      this._map.setView(center, zoom, { animate: false });
    }
  }

  /**
   * Set map view to provided center and zoom with animated transition.
   * @see {@link setView} and {@link _handleSetViewChange} for instant transition.
   */
  private _handleFlyToChange(
    flyTo: { latLng: L.LatLng; zoom: number } | undefined
  ): void {
    if (flyTo === undefined) return;

    // TODO: different paddings depending on screen resolution
    const options: L.FitBoundsOptions = {
      paddingBottomRight: [window.innerWidth / 3, window.innerHeight / 1.5],
      paddingTopLeft: [window.innerWidth / 3, window.innerHeight / 4],
      maxZoom: flyTo.zoom,
    };

    // since map.flyTo doesn't have options for padding,
    // using map.flyToBounds to account for modals so marker can be seen
    this._map.flyToBounds(
      new L.LatLngBounds(flyTo.latLng, flyTo.latLng),
      options
    );
  }
}
