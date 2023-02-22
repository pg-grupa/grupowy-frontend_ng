import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ILocationFull } from 'src/app/core/models/location';
import { Coords } from 'src/app/shared/utils/coords';
import * as L from 'leaflet';

@Component({
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent {
  location!: ILocationFull;

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];
      const coordinates = new L.LatLng(
        this.location.latitude,
        this.location.longitude
      );

      this._router.navigate([], {
        queryParams: {
          '@': Coords.stringify(coordinates),
        },
        queryParamsHandling: 'merge',
      });
    });
  }
}
