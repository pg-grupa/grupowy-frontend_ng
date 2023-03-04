import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILocationFull } from 'src/app/core/models/location';
import { MapModuleService } from '../../services/map-module.service';

import * as L from 'leaflet';
import { skip, Subscription } from 'rxjs';
import {
  trigger,
  transition,
  useAnimation,
  group,
  query,
  animate,
  style,
} from '@angular/animations';
import { fadeIn } from 'src/app/shared/animations/fade/fade-in';
import { fadeOut } from 'src/app/shared/animations/fade/fade-out';
import { slideIn } from 'src/app/shared/animations/slide/slide-in';
import { slideOut } from 'src/app/shared/animations/slide/slide-out';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
  animations: [
    trigger('fadeInOut', [
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
  ],
  host: { '[@fadeInOut]': '' },
})
export class LocationDetailsComponent {
  location!: ILocationFull;
  favourite: boolean = false;
  openMobile: boolean = true;
  movestartSubscription!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapModuleService: MapModuleService,
    private _notificationsService: NotificationsService
  ) {
    // this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];

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

  toggleOpen() {
    this.openMobile = !this.openMobile;
  }

  toggleFavourite() {
    this.favourite = !this.favourite;
    if (this.favourite) {
      this._notificationsService.success('Location added to favourites!');
    } else {
      this._notificationsService.info(
        'Location removed from favourites!',
        3000
      );
    }
  }
}
