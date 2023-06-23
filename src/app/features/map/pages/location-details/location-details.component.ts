import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILocationFull } from 'src/app/core/models/location';
import { MapModuleService } from '../../services/map-module.service';

import * as L from 'leaflet';
import { catchError, Observable, Subscription } from 'rxjs';
import {
  trigger,
  transition,
  useAnimation,
  group,
  query,
  animate,
  animateChild,
} from '@angular/animations';
import { fadeIn } from 'src/app/shared/animations/fade/fade-in';
import { fadeOut } from 'src/app/shared/animations/fade/fade-out';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { APIService } from 'src/app/core/services/api.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CacheService } from 'src/app/core/services/cache.service';

@Component({
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
  animations: [
    trigger('fadeInOutInner', [
      transition(':enter', [
        useAnimation(fadeIn, { params: { from: '0, 100%' } }),
      ]),
      transition(':leave', [
        group([
          // inner router stays in DOM for duration of animation
          query(':leave', [animate('375ms')], { optional: true }),
          useAnimation(fadeOut, { params: { to: '0, 100%' } }),
        ]),
      ]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [query('@*', [animateChild()], { optional: true })]),
      transition(':leave', [query('@*', [animateChild()], { optional: true })]),
    ]),
  ],
  host: { '[@fadeInOut]': '' },
})
export class LocationDetailsComponent {
  location!: ILocationFull;
  openMobile: boolean = true;
  movestartSubscription!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapModuleService: MapModuleService,
    private _notificationsService: NotificationService,
    private _authService: AuthService,
    private _apiService: APIService,
    private _cacheService: CacheService,
    private _logger: LoggerService
  ) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];
      this.location.favourited = this._cacheService.isFavorite(
        this.location.id
      );

      const coordinates = new L.LatLng(
        this.location.latitude,
        this.location.longitude
      );

      const zoom = this._mapModuleService.zoom;

      this._mapModuleService.selectLocation(this.location);
      this._mapModuleService.flyTo(coordinates, zoom);
      this.openMobile = true;
    });

    this.movestartSubscription = this._mapModuleService.movestart$.subscribe(
      () => {
        this.openMobile = false;
      }
    );
  }

  ngOnDestroy(): void {
    this._mapModuleService.clearSelectedLocation();
    this.movestartSubscription.unsubscribe();
  }

  navigateTo() {
    this._router.navigate(['/', 'navigate'], {
      queryParams: {
        to: `${this.location.latitude},${this.location.longitude}`,
      },
    });
  }

  toggleOpen() {
    this.openMobile = !this.openMobile;
  }

  toggleFavourite() {
    if (!this._authService.isAuthenticated) {
      this._router.navigate([{ outlets: { auth: ['account', 'auth'] } }], {
        queryParamsHandling: 'preserve',
      });
      return;
    }

    let handler: Observable<any>;
    if (this.location.favourited) {
      handler = this._cacheService.removeFavourite(this.location.id);
    } else {
      handler = this._cacheService.addFavourite(this.location);
    }

    handler
      .pipe(
        catchError((response) => {
          this._handleError(response);
          throw response;
        })
      )
      .subscribe(() => {
        this.location.favourited = !this.location.favourited;
        this._showSuccessNotification();
      });
  }

  private _handleError(response: any) {
    this._logger.error(
      'LocationDetailsComponent',
      'Toggle favourite error',
      response
    );
    if (response instanceof HttpErrorResponse) {
      if ('details' in response.error) {
        this._notificationsService.error(response.error.details);
      }
    }
  }

  private _showSuccessNotification() {
    if (this.location.favourited) {
      this._notificationsService.success('Location added to favourites.');
    } else {
      this._notificationsService.success('Location removed from favourites.');
    }
  }
}
