import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILocation, ILocationFull } from 'src/app/core/models/location';
import { ILocationType } from 'src/app/core/models/location-type';
import { CacheService } from 'src/app/core/services/cache.service';
import { MapService } from 'src/app/core/services/map.service';

@Component({
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
})
export class LocationDetailsComponent implements OnInit {
  location!: ILocationFull;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapService: MapService
  ) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];
      this._mapService.flyTo(this.location.latitude, this.location.longitude);
    });
  }
}
