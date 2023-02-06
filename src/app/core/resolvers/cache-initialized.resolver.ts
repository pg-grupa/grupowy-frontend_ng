import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { first, Observable } from 'rxjs';
import { CacheService } from '../services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class CacheInitializedResolver implements Resolve<boolean> {
  constructor(private _cache: CacheService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._cache.initialized$.pipe(first());
  }
}
