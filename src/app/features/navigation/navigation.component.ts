import { Component, OnDestroy, ViewChild } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { CacheService } from 'src/app/core/services/cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Coords } from 'src/app/shared/utils/coords';
import { LeafletMapComponent } from 'src/app/core/components/map/leaflet-map.component';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnDestroy {
  @ViewChild(LeafletMapComponent) _mapComponent!: LeafletMapComponent;

  userPosition: L.LatLng | null = null;
  startPosition: L.LatLng | null = null;
  destinationPosition: L.LatLng | null = null;

  hideUI: boolean = false;

  userPositionSubscription: Subscription;

  /** Map center */
  private _center: L.LatLng = new L.LatLng(
    environment.initMapConfig.lat,
    environment.initMapConfig.lng
  );
  set center(val: L.LatLng) {
    this._center = val;
  }
  get center(): L.LatLng {
    return this._center;
  }

  /** Map zoom */
  _zoom: number = environment.initMapConfig.zoom;
  set zoom(val: number) {
    this._zoom = val;
  }
  get zoom(): number {
    return this._zoom;
  }

  constructor(
    private _cacheService: CacheService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    // * Check current url for initial map params
    const params = this._route.snapshot.queryParamMap;

    // initialize map center
    if (params.has('to')) {
      const destination = Coords.parse(params.get('to')!);
      if (destination) {
        this.destinationPosition = destination;
        this._center = destination;
      }
    }

    // initialize map center
    if (params.has('from')) {
      const start = Coords.parse(params.get('from')!);
      if (start) {
        this.startPosition = start;
      }
    }

    if (this.destinationPosition && this.startPosition) {
      setTimeout(() => {
        this._mapComponent.flyToBounds(
          new L.LatLngBounds(this.startPosition!, this.destinationPosition!),
          {
            noMoveStart: true,
          }
        );
      });
    }

    this.userPositionSubscription = this._cacheService.userPosition$.subscribe(
      (position) => {
        this.userPosition = position;
      }
    );
  }

  ngOnDestroy() {
    this.userPositionSubscription.unsubscribe();
  }
}
