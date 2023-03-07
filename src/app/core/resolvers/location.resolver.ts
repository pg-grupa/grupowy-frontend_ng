import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ILocation } from 'src/app/core/models/location';
import { CacheService } from '../services/cache.service';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class LocationResolver implements Resolve<ILocation> {
  constructor(
    private _cacheService: CacheService,
    private _logger: LoggerService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ILocation> {
    // TODO: error handling - redirect to error page
    return this._cacheService
      .getLocationDetails(+route.paramMap.get('id')!)
      .pipe(
        tap((data) => {
          this._logger.debug('LocationResolver', 'Resolved data:', data);
        })
      );
  }
}
