import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { first, Observable, of } from 'rxjs';
import { IMapState } from '../interfaces/map-state';
import { MapService } from '../services/map.service';

@Injectable({
  providedIn: 'root',
})
export class MapInitializedResolver implements Resolve<IMapState> {
  constructor(private _mapService: MapService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IMapState> {
    return this._mapService.mapState$.pipe(first());
  }
}
