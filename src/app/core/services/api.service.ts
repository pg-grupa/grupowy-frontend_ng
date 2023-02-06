import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILocationQueryParams } from '../interfaces/location-query-params';
import { ILocation } from '../models/location';
import { ILocationType } from '../models/location-type';

/** Service responsible for api requests. */
@Injectable({
  providedIn: 'root',
})
export class APIService {
  /** API urls used by this service. */
  private _apiUrls = {
    types: 'types/',
    locations: 'locations/',
  };

  /** @constructor */
  constructor(private _http: HttpClient) {}

  /** Returns observable of all location types. */
  getTypes(): Observable<ILocationType[]> {
    return this._http.get<ILocationType[]>(this._apiUrls.types);
  }

  /** Returns observable of locations meeting the given query params. */
  getLocations(params: ILocationQueryParams) {
    return this._http.get<ILocation[]>(this._apiUrls.locations, {
      params: params as any,
    });
  }
}
