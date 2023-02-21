import { Component, OnInit } from '@angular/core';
import { IBoundsQueryParams } from 'src/app/core/interfaces/location-query-params';
import { ILocation } from 'src/app/core/models/location';
import { APIService } from 'src/app/core/services/api.service';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent {
  locations: ILocation[] = [];

  center: L.LatLng;
  zoom = environment.initMapConfig.zoom;

  constructor(private _apiService: APIService) {
    this.center = new L.LatLng(
      environment.initMapConfig.lat,
      environment.initMapConfig.lng
    );
  }

  onBoundsChange(bounds: L.LatLngBounds) {
    const query: IBoundsQueryParams = {
      longitude__gte: bounds.getWest(),
      longitude__lt: bounds.getEast(),
      latitude__gte: bounds.getSouth(),
      latitude__lt: bounds.getNorth(),
    };
    this._apiService.getLocations(query).subscribe((locations: ILocation[]) => {
      this.locations = locations;
    });
  }

  onLocationClick(location: ILocation) {
    this.center = new L.LatLng(location.latitude, location.longitude);
    this.zoom = 17;
  }
}
