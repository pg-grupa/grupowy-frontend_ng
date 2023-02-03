import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILocationQueryParams } from '../interfaces/location-query-params';
import { ILocation } from '../models/location';
import { ILocationType } from '../models/location-type';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  /** API urls used by this service */
  private _apiUrls = {
    types: 'types/',
    locations: 'locations/',
  };

  constructor(private _http: HttpClient) {}

  getTypes() {
    return this._http.get<ILocationType[]>(this._apiUrls.types);
  }

  getLocations(params: ILocationQueryParams) {
    return this._http.get<ILocation[]>(this._apiUrls.locations, {
      params: params as any,
    });
  }
}
