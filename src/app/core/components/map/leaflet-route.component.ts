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
import 'leaflet-routing-machine';
import { take } from 'rxjs';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'core-route[start][destination]',
  template: '',
})
export class LeafletRouteComponent implements OnInit, OnDestroy {
  @Input() start!: L.LatLngExpression;
  @Input() destination!: L.LatLngExpression;

  routingControl?: L.Routing.Control;

  constructor(protected _mapService: MapService) {}

  ngOnInit(): void {
    this._mapService.ready$.pipe(take(1)).subscribe(() => {
      const plan = L.Routing.plan(
        [L.latLng(this.start), L.latLng(this.destination)],
        {
          createMarker: (i: number, waypoint: any, n: number) => {
            return false;
          },
        }
      );

      this.routingControl = L.Routing.control({
        plan: plan,
        routeWhileDragging: true,
        show: false,
        lineOptions: {
          styles: [
            { color: 'black', opacity: 0.15, weight: 9 },
            { color: 'white', opacity: 0.8, weight: 6 },
            { color: 'RoyalBlue', opacity: 1, weight: 5 },
          ],
        } as any,
        addWaypoints: false,
      });
      this._mapService.addControl(this.routingControl);
      this._mapService.flyToBounds(
        L.latLngBounds(this.start, this.destination)
      );
    });
  }

  ngOnDestroy(): void {
    if (this.routingControl) {
      this._mapService.removeControl(this.routingControl);
    }
  }
}
