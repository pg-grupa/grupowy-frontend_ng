import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ILocation, ILocationFull } from 'src/app/core/models/location';
import * as L from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { Coords } from 'src/app/shared/utils/coords';
import { MapPageService } from './map-page.service';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  // providers: [MapPageService],
})
export class MapPageComponent implements OnInit, OnDestroy {
  locations$!: Observable<ILocation[]>;
  // selectedCoordinates$!: Observable<L.LatLng | null>;
  // selectedLocation$!: Observable<ILocation | ILocationFull | null>;

  selectedCoordinates: L.LatLng | null = null;
  selectedLocation: ILocation | ILocationFull | null = null;

  selectedTypesCount = 0;

  center!: L.LatLng;
  zoom!: number;
  flyTo?: [L.LatLng, number];

  locationModal: boolean = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapPageService: MapPageService
  ) {}

  ngOnInit(): void {
    const params = this._route.snapshot.queryParamMap;

    if (params.has('@')) {
      const center = Coords.parse(params.get('@')!);
      if (center && !center.equals(this.center)) {
        this.center = center;
        this._mapPageService.onCenterChange(this.center);
      }
    } else {
      this.center = this._mapPageService.center;
    }

    if (params.has('z')) {
      const zoom = parseInt(params.get('z')!);

      if (zoom !== this.zoom) {
        this.zoom = zoom;
        this._mapPageService.onZoomChange(this.zoom);
      }
    } else {
      this.zoom = this._mapPageService.zoom;
    }

    if (params.has('type')) {
      const selectedTypes = params.getAll('type').map((type) => parseInt(type));
      this._mapPageService.selectTypes(selectedTypes);
    }

    this._initSubscriptions();

    this._updateUrl();
  }

  private _initSubscriptions(): void {
    this.locations$ = this._mapPageService.locations$;

    const selectedTypesSubscription =
      this._mapPageService.selectedTypes$.subscribe((selectedTypes) => {
        this.selectedTypesCount = selectedTypes.length;
        this._updateUrl(selectedTypes);
      });
    this._subscriptions.push(selectedTypesSubscription);

    const flyToSubscription = this._mapPageService.flyTo$.subscribe((flyTo) => {
      setTimeout(() => {
        this.flyTo = flyTo;
      });
    });
    this._subscriptions.push(flyToSubscription);

    const selectedCoordinatesSubscription =
      this._mapPageService.selectedCoordinates$.subscribe(
        (selectedCoordinates) => {
          if (selectedCoordinates) {
            this.selectedCoordinates = null;
          }
          setTimeout(() => {
            this.selectedCoordinates = selectedCoordinates;
          });
        }
      );
    this._subscriptions.push(selectedCoordinatesSubscription);

    const selectedLocationSubscription =
      this._mapPageService.selectedLocation$.subscribe((selectedLocation) => {
        if (selectedLocation) {
          this.selectedLocation = null;
        }
        setTimeout(() => {
          this.selectedLocation = selectedLocation;
        });
      });
    this._subscriptions.push(selectedLocationSubscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private _updateUrl(selectedTypes?: number[]): void {
    if (selectedTypes === undefined) {
      selectedTypes = this._mapPageService.selectedTypes;
    }
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        '@': Coords.stringify(this._mapPageService.center),
        z: this._mapPageService.zoom,
        type: selectedTypes,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onBoundsChange(bounds: L.LatLngBounds) {
    this._mapPageService.onBoundsChange(bounds);
  }

  onCenterChange(center: L.LatLng) {
    // if (center.equals(this.center)) return;
    // this.center = center;
    this._mapPageService.onCenterChange(center);

    this._updateUrl();
  }

  onZoomChange(zoom: number) {
    // if (zoom === this.zoom) return;
    // this.zoom = zoom;
    this._mapPageService.onZoomChange(zoom);
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

  openModal(): void {
    setTimeout(() => {
      this.locationModal = true;
    });
  }

  closeModal(): void {
    this.locationModal = false;
  }
}
