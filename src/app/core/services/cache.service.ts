import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject, take } from 'rxjs';
import { ILocation } from '../models/location';
import { ILocationType } from '../models/location-type';
import { APIService } from './api.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  /** Emits true after initializing _locationTypes with data from api */
  private _initializedSubject: ReplaySubject<boolean> = new ReplaySubject(1);
  initialized$: Observable<boolean> = this._initializedSubject.asObservable();

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
  }

  getLocationTypes() {
    return this._locationTypes;
  }

  getLocationType(id: number): ILocationType | undefined {
    return this._locationTypes.find((type) => type.id === id);
  }
}
