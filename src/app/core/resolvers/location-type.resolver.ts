import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ILocationType } from '../models/location-type';
import { APIService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LocationTypeResolver implements Resolve<ILocationType[]> {
  constructor(private _api: APIService) {
    console.warn('resolver');
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ILocationType[]> {
    return this._api.getTypes();
  }
}
