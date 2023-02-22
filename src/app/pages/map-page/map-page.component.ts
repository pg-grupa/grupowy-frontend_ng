import { Component, OnInit } from '@angular/core';
import { IBoundsQueryParams } from 'src/app/core/interfaces/location-query-params';
import { ILocation } from 'src/app/core/models/location';
import { APIService } from 'src/app/core/services/api.service';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Coords } from 'src/app/shared/utils/coords';

@Component({
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent {
  locations: ILocation[] = [];
  selectedTypes: number[] = [];

  center: L.LatLng;
  zoom = environment.initMapConfig.zoom;

  locationModal: boolean = false;

  constructor(
    private _apiService: APIService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.center = new L.LatLng(
      environment.initMapConfig.lat,
      environment.initMapConfig.lng
    );

    this._route.queryParamMap.subscribe((params) => {
      if (params.has('@')) {
        const center = Coords.parse(params.get('@')!);
        if (center && !center.equals(this.center)) this.center = center;
      }
      if (params.has('z')) {
        const zoom = parseInt(params.get('z')!);

        if (zoom !== this.zoom) {
          this.zoom = zoom;
        }
      }
      if (params.has('type')) {
        this.selectedTypes = params
          .getAll('type')
          .map((type) => parseInt(type));
      } else {
        this.selectedTypes = [];
      }
    });
  }

  onBoundsChange(bounds: L.LatLngBounds) {
    const query: IBoundsQueryParams = {
      longitude__gte: bounds.getWest(),
      longitude__lt: bounds.getEast(),
      latitude__gte: bounds.getSouth(),
      latitude__lt: bounds.getNorth(),
    };
    if (this.selectedTypes.length) {
      query.type = this.selectedTypes;
    }
    this._apiService.getLocations(query).subscribe((locations: ILocation[]) => {
      this.locations = locations;
    });
  }

  onCenterChange(center: L.LatLng) {
    if (center.equals(this.center)) return;

    this.center = center;
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { '@': Coords.stringify(center), z: this.zoom },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onZoomChange(zoom: number) {
    if (zoom === this.zoom) return;
    this.zoom = zoom;
  }

  onLocationClick(location: ILocation) {
    // this.center = new L.LatLng(location.latitude, location.longitude);
    this._router.navigate(['location', location.id], {
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }

  openModal(): void {
    setTimeout(() => {
      this.locationModal = true;
    });
  }

  closeModal(): void {
    this.locationModal = false;
  }
}
