import { Component, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ILocation, ILocationFull } from 'src/app/core/models/location';

import * as L from 'leaflet';
import { MapModuleService } from './services/map-module.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Coords } from 'src/app/shared/utils/coords';
import { LeafletMapComponent } from 'src/app/core/components/map/leaflet-map.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  @ViewChild(LeafletMapComponent) _mapComponent!: LeafletMapComponent;

  locations$!: Observable<ILocation[]>;
  userPosition: L.LatLng | null = null;

  selectedCoordinates: L.LatLng | null = null;
  selectedLocation: ILocation | ILocationFull | null = null;
  selectedTypesCount = 0;

  /** Map center */
  private _center!: L.LatLng;
  set center(val: L.LatLng) {
    this._center = val;
    this._mapModuleService.onCenterChange(val);
    this._updateUrl();
  }
  get center(): L.LatLng {
    return this._center;
  }

  /** Map zoom */
  _zoom!: number;
  set zoom(val: number) {
    this._zoom = val;
    this._mapModuleService.onZoomChange(val);
  }
  get zoom(): number {
    return this._zoom;
  }

  hideUI: boolean = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _mapModuleService: MapModuleService,
    private _cacheService: CacheService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // * Check current url for initial map params
    const params = this._route.snapshot.queryParamMap;

    // initialize map center
    if (params.has('@')) {
      const center = Coords.parse(params.get('@')!);
      if (center && !center.equals(this.center)) {
        this._center = center;
        this._mapModuleService.onCenterChange(this.center);
      }
    } else {
      this._center = this._mapModuleService.center;
    }

    // initialize map zoom
    if (params.has('z')) {
      const zoom = parseInt(params.get('z')!);

      if (zoom !== this.zoom) {
        this._zoom = zoom;
        this._mapModuleService.onZoomChange(this.zoom);
      }
    } else {
      this._zoom = this._mapModuleService.zoom;
    }

    // initialize selected types
    if (params.has('type')) {
      const selectedTypes = params.getAll('type').map((type) => parseInt(type));
      this._mapModuleService.selectTypes(selectedTypes);
    }

    this._initSubscriptions();

    this._updateUrl();
  }

  private _initSubscriptions(): void {
    this.locations$ = this._mapModuleService.locations$;
    this.userPosition = null;

    const selectedTypesSubscription =
      this._mapModuleService.selectedTypes$.subscribe((selectedTypes) => {
        this.selectedTypesCount = selectedTypes.length;
        this._updateUrl(selectedTypes);
      });
    this._subscriptions.push(selectedTypesSubscription);

    const flyToSubscription = this._mapModuleService.flyTo$.subscribe(
      (flyTo) => {
        // timeout as workaround for NG100
        setTimeout(() => {
          this._mapComponent.flyTo(flyTo.latLng, flyTo.zoom, {
            noMoveStart: true,
          });
        });
      }
    );
    this._subscriptions.push(flyToSubscription);

    const selectedCoordinatesSubscription =
      this._mapModuleService.selectedCoordinates$.subscribe(
        (selectedCoordinates) => {
          if (selectedCoordinates) {
            // set to null to force marker destroy
            this.selectedCoordinates = null;
          }
          // timeout as workaround for NG100
          setTimeout(() => {
            this.selectedCoordinates = selectedCoordinates;
          });
        }
      );
    this._subscriptions.push(selectedCoordinatesSubscription);

    const selectedLocationSubscription =
      this._mapModuleService.selectedLocation$.subscribe((selectedLocation) => {
        if (selectedLocation) {
          // set to null to force marker destroy
          this.selectedLocation = null;
        }
        // timeout as workaround for NG100
        setTimeout(() => {
          this.selectedLocation = selectedLocation;
        });
      });
    this._subscriptions.push(selectedLocationSubscription);

    const userPositionSubscription = this._cacheService.userPosition$.subscribe(
      (position) => {
        this.userPosition = position;
      }
    );
    this._subscriptions.push(userPositionSubscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /** Update window.location with current query */
  private _updateUrl(selectedTypes?: number[]): void {
    if (selectedTypes === undefined) {
      selectedTypes = this._mapModuleService.selectedTypes;
    }
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        '@': Coords.stringify(this._mapModuleService.center),
        z: this._mapModuleService.zoom,
        type: selectedTypes,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onMoveStart(): void {
    this.hideUI = true;
    this._mapModuleService.onMovestart();
  }

  onMoveEnd(bounds: L.LatLngBounds) {
    this.hideUI = false;
    this._mapModuleService.onBoundsChange(bounds);
  }

  onLocationClick(location: ILocation) {
    this._router.navigate(['location', location.id], {
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }

  onMapClick(coords: L.LatLng) {
    this._router.navigate(['coordinates', Coords.stringify(coords)], {
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }

  flyToUserPosition() {
    if (this.userPosition) {
      this._mapComponent.flyTo(this.userPosition, 18);
    }
  }
}
