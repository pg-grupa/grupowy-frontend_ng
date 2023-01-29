import { Injectable } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { ReplaySubject } from 'rxjs';
import { LocationQueryParams } from '../interfaces/LocationQueryParams';
import { APIService } from './api.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapBoundsSubject: ReplaySubject<LatLngBounds> = new ReplaySubject(1);

  /* Emit map's new bounds everytime user stops moving in MapComponent */
  public readonly mapBounds$ = this.mapBoundsSubject.asObservable();

  constructor(private _api: APIService, private _logger: LoggerService) {
    // this._api.getTypes().subscribe((res) => {
    //   this._logger.error('APIService', '', res);
    //   this._logger.warn('APIService', '', res);
    //   this._logger.info('APIService', '', res);
    //   this._logger.debug('APIService', '', res);
    // });
  }

  public onBoundsChanged(bounds: LatLngBounds) {
    this._logger.debug('MapService', 'Bounds changed:', bounds);
    this.mapBoundsSubject.next(bounds);
    // const params: LocationQueryParams = {
    //   longitude__gte: bounds.getWest(),
    //   longitude__lt: bounds.getEast(),
    //   latitude__gte: bounds.getSouth(),
    //   latitude__lt: bounds.getNorth(),
    // };
    // this._api.getLocations(params).subscribe(console.log);
  }
}
