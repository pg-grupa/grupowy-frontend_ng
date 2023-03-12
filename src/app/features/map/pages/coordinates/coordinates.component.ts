import {
  trigger,
  transition,
  useAnimation,
  group,
  query,
  animate,
  animateChild,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeosearchService } from 'src/app/core/services/geosearch.service';
import { fadeIn } from 'src/app/shared/animations/fade/fade-in';
import { fadeOut } from 'src/app/shared/animations/fade/fade-out';
import { PrettyLatLng } from 'src/app/shared/utils/coords';
import { MapModuleService } from '../../services/map-module.service';

@Component({
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.scss'],
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
export class CoordinatesComponent implements OnInit, OnDestroy {
  coords!: PrettyLatLng;
  openMobile: boolean = true;
  movestartSubscription!: Subscription;
  address?: { [key: string]: string };

  constructor(
    private _route: ActivatedRoute,
    private _mapModuleService: MapModuleService,
    private _geosearchService: GeosearchService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((params: ParamMap) => {
      let paramCoords = params.get('coords');

      if (paramCoords) {
        this.coords = PrettyLatLng.parse(paramCoords)!;
        // TODO: parse error fallback

        this._mapModuleService.selectCoordinates(this.coords);
        this._mapModuleService.flyTo(this.coords);

        this.address = undefined;

        this._geosearchService
          .searchCoordinates(this.coords)
          .subscribe((result) => {
            if (result && 'address' in result)
              this.address = result.address as { [key: string]: string };
          });
      }
    });

    this.movestartSubscription = this._mapModuleService.movestart$.subscribe(
      () => {
        this.openMobile = false;
      }
    );
  }

  ngOnDestroy(): void {
    this._mapModuleService.clearSelectedCoordinates();
    this.movestartSubscription.unsubscribe();
  }

  toggleOpen() {
    this.openMobile = !this.openMobile;
  }

  zoomIn() {
    this._mapModuleService.flyTo(this.coords, 18);
  }
}
