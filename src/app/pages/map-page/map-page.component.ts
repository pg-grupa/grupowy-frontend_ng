import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ILocation, ILocationFull } from 'src/app/core/models/location';
import * as L from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { Coords } from 'src/app/shared/utils/coords';
import { MapPageService } from './map-page.service';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MapMode } from 'src/app/core/enums/settings';
import { SettingsService } from 'src/app/core/services/settings.service';
import { CacheService } from 'src/app/core/services/cache.service';
import {
  trigger,
  transition,
  useAnimation,
  group,
  query,
  animate,
  state,
  style,
} from '@angular/animations';
import { fadeIn } from 'src/app/shared/animations/fade/fade-in';
import { fadeOut } from 'src/app/shared/animations/fade/fade-out';

@Component({
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('out => in', [
        useAnimation(fadeIn, { params: { from: '0, 100%' } }),
      ]),
      transition('in => out', [
        group([
          // inner router stays in DOM for duration of animation
          query(':leave', [animate('375ms')], { optional: true }),
          useAnimation(fadeOut, { params: { to: '0, 100%' } }),
        ]),
      ]),
    ]),
  ],
})
export class MapPageComponent implements OnInit, OnDestroy {
  locations$!: Observable<ILocation[]>;
  userPosition: L.LatLng | null = null;

  selectedCoordinates: L.LatLng | null = null;
  selectedLocation: ILocation | ILocationFull | null = null;
  selectedTypesCount = 0;

  mapMode$!: Observable<MapMode>;

  /** Map center */
  center!: L.LatLng;
  /** Map zoom */
  zoom!: number;

  /**
   * On change pan map to selected center and zoom.
   * @type {{center: L.LatLng, zoom: number}}
   */
  flyTo?: { latLng: L.LatLng; zoom: number };

  locationModal: boolean = false;
  hideUI: boolean = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapPageService: MapPageService,
    private _settingsService: SettingsService,
    private _cacheService: CacheService
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
    this.mapMode$ = this._settingsService.mapMode$;
    this.userPosition = null;

    const selectedTypesSubscription =
      this._mapPageService.selectedTypes$.subscribe((selectedTypes) => {
        this.selectedTypesCount = selectedTypes.length;
        this._updateUrl(selectedTypes);
      });
    this._subscriptions.push(selectedTypesSubscription);

    const flyToSubscription = this._mapPageService.flyTo$.subscribe((flyTo) => {
      // timeout as workaround for NG100
      setTimeout(() => {
        this.flyTo = flyTo;
      });
    });
    this._subscriptions.push(flyToSubscription);

    const selectedCoordinatesSubscription =
      this._mapPageService.selectedCoordinates$.subscribe(
        (selectedCoordinates) => {
          if (selectedCoordinates) {
            // set to null to force component destroy
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
      this._mapPageService.selectedLocation$.subscribe((selectedLocation) => {
        if (selectedLocation) {
          // set to null to force component destroy
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

  onMoveStart(): void {
    this.hideUI = true;
  }

  onBoundsChange(bounds: L.LatLngBounds) {
    this.hideUI = false;
    this._mapPageService.onBoundsChange(bounds);
  }

  onCenterChange(center: L.LatLng) {
    this.center = center;
    this._mapPageService.onCenterChange(center);
    this._updateUrl();
  }

  onZoomChange(zoom: number) {
    this.zoom = zoom;
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

  flyToUserPosition() {
    if (this.userPosition) {
      this.flyTo = {
        latLng: this.userPosition,
        zoom: 18,
      };
    }
  }

  openModal(): void {
    // timeout as workaround for NG100
    setTimeout(() => {
      this.locationModal = true;
    });
  }

  closeModal(): void {
    this.locationModal = false;
  }
}
