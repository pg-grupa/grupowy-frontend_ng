import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-extra-markers';
import { take } from 'rxjs';
import { LayerGroupService } from 'src/app/core/services/layer-group.service';

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
  selector: 'core-marker[coordinates]',
  template: '',
})
export class MapMarkerComponent implements OnInit, OnDestroy {
  @Input() coordinates!: L.LatLngExpression;
  @Input() color: MarkerColor = 'cyan';
  @Input() icon?: string;
  @Input() iconColor: string = 'white';
  @Input() tooltip?: string;

  @Input() markerOptions?: L.MarkerOptions;
  @Input() iconOptions?: L.ExtraMarkers.IconOptions;
  @Input() tooltipOptions?: L.TooltipOptions;

  @Output() click = new EventEmitter<void>();

  private _marker?: L.Marker;

  constructor(protected _layerGroup: LayerGroupService) {}

  ngOnInit(): void {
    this._marker = this._generateMarker();

    this._layerGroup.ready$.pipe(take(1)).subscribe(() => {
      this._layerGroup.addLayer(this._marker!);
    });
  }

  ngOnDestroy(): void {
    this._layerGroup.removeLayer(this._marker!);
  }

  protected _generateMarker(): L.Marker {
    const icon = L.ExtraMarkers.icon({
      icon: this.icon,
      iconColor: this.iconColor,
      markerColor: this.color,
      prefix: 'fa',
      ...this.iconOptions,
    });
    const marker = L.marker(this.coordinates, {
      icon: icon,
      ...this.markerOptions,
    });

    if (this.tooltip) {
      marker.bindTooltip(this.tooltip, {
        offset: [10, -22],
        ...this.tooltipOptions,
      });
    }

    marker.on('click', () => {
      this.click.emit();
    });

    return marker;
  }
}
