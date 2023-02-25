import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ILocationFull } from 'src/app/core/models/location';
import { Coords } from 'src/app/shared/utils/coords';
import * as L from 'leaflet';
import { MapPageService } from '../map-page.service';

@Component({
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent implements OnInit, OnDestroy {
  location!: ILocationFull;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapPageService: MapPageService
  ) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];
      const coordinates = new L.LatLng(
        this.location.latitude,
        this.location.longitude
      );

      const zoom = this._mapPageService.zoom;

      this._mapPageService.selectLocation(this.location);
      this._mapPageService.flyTo(coordinates, zoom);
    });
  }

  ngOnDestroy(): void {
    this._mapPageService.clearSelectedLocation();
  }

  zoomIn(): void {
    const coordinates = new L.LatLng(
      this.location.latitude,
      this.location.longitude
    );
    this._mapPageService.flyTo(coordinates, 18);
  }

  reportIssue(): void {
    this._router.navigate(
      [{ outlets: { report: ['issue', 'location', this.location.id] } }],
      {
        queryParamsHandling: 'preserve',
      }
    );
  }
}
