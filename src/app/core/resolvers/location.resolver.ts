import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ILocation, ILocationFull } from 'src/app/core/models/location';
import { CacheService } from '../services/cache.service';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class LocationResolver implements Resolve<ILocationFull> {
  constructor(
    private _cacheService: CacheService,
    private _logger: LoggerService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ILocationFull> {
    // TODO: error handling - redirect to error page
    return this._cacheService
      .getLocationDetails(+route.paramMap.get('id')!)
      .pipe(
        map((data) => {
          this._logger.debug('LocationResolver', 'Resolved data:', data);
          data.type = this._cacheService.getLocationType(data.place_type_id)!;
          return data;
        })
      );
  }
}
