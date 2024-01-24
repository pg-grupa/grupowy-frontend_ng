import { Injectable } from '@angular/core';
import {
  catchError,
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  ReplaySubject,
  skip,
  take,
  tap,
} from 'rxjs';
import { IBoundsQueryParams } from '../interfaces/location-query-params';
import {
  IFavouriteLocation,
  ILocation,
  ILocationFull,
} from '../models/location';
import { ILocationType } from '../models/location-type';
import { APIService } from './api.service';
import { LoggerService } from './logger.service';
import * as L from 'leaflet';
import { LoadingService } from './loading.service';
import { AuthService } from './auth.service';

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

  private _cachedLocations: ILocation[] | null = null;
  private _locationTypes: ILocationType[] = [];

  public favouriteLocations: IFavouriteLocation[] = [];

  constructor(
    private _apiService: APIService,
    private _logger: LoggerService,
    private _loadingService: LoadingService,
    private _authService: AuthService
  ) {
    this._loadingService.start();
    this._logger.debug('CacheService', 'constructor');
    forkJoin({
      types: this._apiService.getTypes(),
      favourites: this.getFavourites(),
      locations: this._apiService.getFilteredLocations({}),
    })
      .pipe(
        finalize(() => {
          this._loadingService.stop();
        })
      )
      .subscribe((results) => {
        this._locationTypes = results.types;
        this.favouriteLocations = results.favourites;
        this._initializedSubject.next(true);
        this._logger.debug('CacheService', 'Types', this._locationTypes);
        this._logger.debug(
          'CacheService',
          'Favourites',
          this.favouriteLocations
        );
        // timeout as a fix to NG100
        setTimeout(() => {
          this._cachedLocations = results.locations;
        }, 1000);
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

    this._authService.isAuthenticated$
      .pipe(skip(1))
      .subscribe((isAuthenticated) => {
        this.getFavourites().subscribe((favourites) => {
          this.favouriteLocations = favourites;
        });
      });
  }

  getLocationTypes() {
    return this._locationTypes;
  }

  getLocationType(id: number): ILocationType | undefined {
    return this._locationTypes.find((type) => type.id === id);
  }

  getLocations(
    params: IBoundsQueryParams,
    noLoading: boolean = false
  ): Observable<ILocation[]> {
    if (this._cachedLocations) {
      let results = [];
      for (let index = 0; index < this._cachedLocations.length; index++) {
        const location = this._cachedLocations[index];
        if (
          location.latitude >= params.lat1 &&
          location.latitude <= params.lat2 &&
          location.longitude >= params.lng1 &&
          location.longitude <= params.lng2
        ) {
          results.push(location);
        }
      }
      return of(results);
    }
    return this._apiService.getLocations(params, noLoading);
  }

  getLocationDetails(id: number): Observable<ILocationFull> {
    return this._apiService.getLocationDetails(id);
  }

  getFavourites(): Observable<IFavouriteLocation[]> {
    if (!this._authService.isAuthenticated) {
      return of([]);
    }
    return this._apiService.getFavourites();
  }

  isFavorite(id: number): boolean {
    return (
      this.favouriteLocations.find((location) => location.id === id) !==
      undefined
    );
  }

  addFavourite(location: ILocationFull) {
    return this._apiService.addFavourite(location.id).pipe(
      tap(() => {
        if (!this.isFavorite(location.id)) {
          this.favouriteLocations.push({
            id: location.id,
            name: location.name,
            type: location.type.name,
          });
        }
      })
    );
  }

  removeFavourite(id: number) {
    return this._apiService.removeFavourite(id).pipe(
      tap(() => {
        this.favouriteLocations = this.favouriteLocations.filter(
          (location) => location.id !== id
        );
      })
    );
  }
}
