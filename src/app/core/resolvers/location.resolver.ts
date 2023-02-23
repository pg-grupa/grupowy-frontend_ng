import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ILocation } from 'src/app/core/models/location';
import { CacheService } from '../services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class LocationResolver implements Resolve<ILocation> {
  constructor(private _cacheService: CacheService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ILocation> {
    // TODO: error handling - redirect to error page
    return this._cacheService.getLocationDetails(+route.paramMap.get('id')!);
  }
}
