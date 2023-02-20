import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ILocation } from 'src/app/core/models/location';
import { APIService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LocationResolver implements Resolve<ILocation> {
  constructor(private _api: APIService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ILocation> {
    // TODO: error handling - redirect to error page
    return this._api.getLocationDetails(+route.paramMap.get('id')!);
  }
}
