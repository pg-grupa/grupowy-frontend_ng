import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Coords } from 'src/app/shared/utils/coords';
import { MapPageService } from '../map-page.service';

@Component({
  templateUrl: './coordinates-modal.component.html',
  styleUrls: ['./coordinates-modal.component.scss'],
})
export class CoordinatesModalComponent implements OnInit, OnDestroy {
  coords!: L.LatLng;

  constructor(
    private _route: ActivatedRoute,
    private _mapPageService: MapPageService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((params: ParamMap) => {
      let paramCoords = params.get('coords');

      if (paramCoords) {
        this.coords = Coords.parse(paramCoords)!;
        // TODO: parse error fallback

        this._mapPageService.selectCoordinates(this.coords);
        this._mapPageService.flyTo(this.coords);
      }
    });
  }

  zoomIn() {
    this._mapPageService.flyTo(this.coords, 18);
  }

  ngOnDestroy(): void {
    this._mapPageService.clearSelectedCoordinates();
  }
}
