import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject, take } from 'rxjs';
import { IBoundsQueryParams } from '../interfaces/location-query-params';
import { ILocation } from '../models/location';
import { ILocationType } from '../models/location-type';
import { APIService } from './api.service';
import { LoggerService } from './logger.service';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  /** Emits true after initializing _locationTypes with data from api */
  private _initializedSubject: ReplaySubject<boolean> = new ReplaySubject(1);
  readonly initialized$: Observable<boolean> =
    this._initializedSubject.asObservable();

  private userPositionSubject: ReplaySubject<L.LatLng | null> =
    new ReplaySubject(1);
  readonly userPosition$ = this.userPositionSubject.asObservable();

  private _locationTypes: ILocationType[] = [];

  constructor(private _apiService: APIService, private _logger: LoggerService) {
    this._logger.debug('CacheService', 'constructor');
    this._apiService
      .getTypes()
      .pipe(
        take(1),
        catchError(() => {
          // TODO: error handling, navigate to error page?
          return of([]);
        })
      )
      .subscribe((response) => {
        this._locationTypes = response;
        this._initializedSubject.next(true);
        this._logger.debug('CacheService', 'Initialized');
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userPositionSubject.next(
            L.latLng(position.coords.latitude, position.coords.longitude)
          );
        },
        (error) => {
          this.userPositionSubject.next(null);
          this._logger.warn('CacheService', error.message);
        }
      );
    } else {
      this.userPositionSubject.next(null);
      this._logger.warn('CacheService', 'Geolocation not supported');
    }
  }

  getLocationTypes() {
    return this._locationTypes;
  }

  getLocationType(id: number): ILocationType | undefined {
    return this._locationTypes.find((type) => type.id === id);
  }

  getLocations(params: IBoundsQueryParams): Observable<ILocation[]> {
    // TODO: cache locations in memory
    return this._apiService.getLocations(params);
  }

  getLocationDetails(id: number): Observable<ILocation> {
    return this._apiService.getLocationDetails(id);
  }
}
