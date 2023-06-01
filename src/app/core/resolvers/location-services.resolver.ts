import { inject, Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { IReview } from '../models/review';
import { APIService } from '../services/api.service';
import { IPlaceService } from '../models/location-service';

@Injectable({
  providedIn: 'root',
})
export class LocationServicesResolver implements Resolve<IPlaceService[]> {
  constructor(private _apiService: APIService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IPlaceService[]> {
    const id = +route.paramMap.get('id')!;

    return this._apiService.getLocationServices(id);
  }
}
