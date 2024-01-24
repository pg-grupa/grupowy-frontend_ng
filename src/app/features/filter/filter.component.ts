import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { Coords } from 'src/app/shared/utils/coords';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';
import { LeafletMapComponent } from 'src/app/core/components/map/leaflet-map.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { ILocation } from 'src/app/core/models/location';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnDestroy {
  @ViewChild(LeafletMapComponent) _mapComponent!: LeafletMapComponent;
  @ViewChild(FilterSidebarComponent)
  _filterSidebarComponent!: FilterSidebarComponent;

  userPosition: L.LatLng | null = null;
  selectedCoordinates: L.LatLng | null = null;

  userPositionSubscription: Subscription;

  results: ILocation[] = [];

  /** Map center */
  private _center: L.LatLng = new L.LatLng(
    environment.initMapConfig.lat,
    environment.initMapConfig.lng
  );
  set center(val: L.LatLng) {
    this._center = val;
    this._updateUrl();
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
    if (params.has('@')) {
      const center = Coords.parse(params.get('@')!);
      if (center && !center.equals(this.center)) {
        this._center = center;
      }
    }

    // initialize map zoom
    if (params.has('z')) {
      const zoom = parseInt(params.get('z')!);

      if (zoom !== this.zoom) {
        this._zoom = zoom;
      }
    }

    this.userPositionSubscription = this._cacheService.userPosition$.subscribe(
      (position) => {
        this.userPosition = position;
      }
    );
  }

  ngOnDestroy(): void {
    this.userPositionSubscription.unsubscribe();
  }

  /** Update window.location with current query */
  private _updateUrl(selectedTypes?: number[]): void {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        '@': Coords.stringify(this.center),
        z: this.zoom,
        type: selectedTypes,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  /**
   * Flies the map to the user's current position.
   */
  flyToUserPosition() {
    if (this.userPosition) {
      this._mapComponent.flyTo(this.userPosition, 18);
    }
  }

  onMapClick(coords: L.LatLng) {
    if (this.selectedCoordinates) {
      // force marker destroy
      this.selectedCoordinates = null;
    }
    setTimeout(() => {
      this.selectedCoordinates = coords;
      this._filterSidebarComponent.selectCoords(coords);
    });
  }

  onSearchResults(results: ILocation[]) {
    this.results = results;
  }

  onLocationClick(location: ILocation) {
    console.log(location);
  }
}
