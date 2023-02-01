import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILocationQueryParams } from '../interfaces/location-query-params';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  /** API urls iused by this service */
  private _apiUrls = {
    types: 'types/',
    locations: 'locations/',
  };

  constructor(private _http: HttpClient) {}

  getTypes() {
    return this._http.get(this._apiUrls.types);
  }

  getLocations(params: ILocationQueryParams) {
    return this._http.get(this._apiUrls.locations, { params: params as any });
  }
}
