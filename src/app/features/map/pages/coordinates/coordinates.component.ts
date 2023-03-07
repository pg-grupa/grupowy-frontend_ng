import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Coords, PrettyLatLng } from 'src/app/shared/utils/coords';
import { MapModuleService } from '../../services/map-module.service';

@Component({
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.scss'],
})
export class CoordinatesComponent implements OnInit, OnDestroy {
  coords!: PrettyLatLng;
  openMobile: boolean = true;
  movestartSubscription!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _mapModuleService: MapModuleService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((params: ParamMap) => {
      let paramCoords = params.get('coords');

      if (paramCoords) {
        this.coords = PrettyLatLng.parse(paramCoords)!;
        // TODO: parse error fallback

        this._mapModuleService.selectCoordinates(this.coords);
        this._mapModuleService.flyTo(this.coords);
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
