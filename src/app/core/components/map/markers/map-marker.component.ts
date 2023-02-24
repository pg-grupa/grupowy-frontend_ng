import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-extra-markers';
import { take } from 'rxjs';
import { MapService } from 'src/app/core/components/map/map.service';

type MarkerColor =
  | 'red'
  | 'orange-dark'
  | 'orange'
  | 'yellow'
  | 'blue'
  | 'blue-dark'
  | 'cyan'
  | 'purple'
  | 'violet'
  | 'pink'
  | 'green-dark'
  | 'green'
  | 'green-light'
  | 'black'
  | 'white';

@Component({
  selector: 'map-marker[coordinates]',
  template: '',
})
export class MapMarkerComponent implements AfterViewInit, OnDestroy {
  @Input() coordinates!: L.LatLngExpression;
  @Input() color: MarkerColor = 'cyan';
  @Input() icon?: string;
  @Input() tooltip?: string;
  @Input() clickEvent: boolean = true;

  protected _auxMarker: boolean = false;
  @Input('auxiliary')
  set auxMarker(value: string | undefined) {
    this._auxMarker = value !== undefined;
  }

  @Output() click = new EventEmitter<void>();

  private _marker!: L.Marker;

  constructor(protected _mapService: MapService) {}

  ngAfterViewInit(): void {
    this._marker = this._generateMarker();

    this._mapService.ready$.pipe(take(1)).subscribe(() => {
      this._addToMap();
    });
  }

  ngOnDestroy(): void {
    this._removeFromMap();
  }

  protected _generateMarker(): L.Marker {
    const icon = L.ExtraMarkers.icon({
      icon: this.icon,
      markerColor: this.color,
      prefix: 'fa',
    });
    const marker = L.marker(this.coordinates, {
      icon: icon,
    });

    if (this.tooltip) {
      marker.bindTooltip(this.tooltip, { offset: [10, -22] });
    }

    if (this.clickEvent) {
      marker.on('click', () => {
        this.click.emit();
      });
    }

    return marker;
  }

  protected _addToMap(): void {
    if (this._auxMarker) {
      this._mapService.addAuxMarker(this._marker);
    } else {
      this._mapService.addMarker(this._marker);
    }
  }

  protected _removeFromMap(): void {
    if (this._auxMarker) {
      this._mapService.removeAuxMarker(this._marker);
    } else {
      this._mapService.removeMarker(this._marker);
    }
  }
}
