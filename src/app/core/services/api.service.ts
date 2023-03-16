import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBoundsQueryParams } from '../interfaces/location-query-params';
import { IUser } from '../models/user';
import { ILocation } from '../models/location';
import { ILocationType } from '../models/location-type';
import { IReport } from '../models/report';
import { IReview } from '../models/review';

/** Service responsible for api requests. */
@Injectable({
  providedIn: 'root',
})
export class APIService {
  /** API urls used by this service. */
  private _apiUrls = {
    locations: {
      getTypes: 'locations/types/',
      getLocations: 'locations/list/',
      getLocation: (id: number): string => `locations/details/${id}/`,
      favourite: (id: number): string => `locations/details/${id}/favourite/`,
    },
    reports: {
      postReport: 'report/',
    },
    reviews: {
      locationReviews: (id: number) => `reviews/location/${id}/`,
      myReview: (id: number) => `reviews/location/${id}/my-review/`,
    },
  };

  /** @constructor */
  constructor(private _http: HttpClient) {}

  /** Returns observable of all location types. */
  getTypes(): Observable<ILocationType[]> {
    return this._http.get<ILocationType[]>(this._apiUrls.locations.getTypes);
  }

  /** Returns observable of locations meeting the given query params. */
  getLocations(params: IBoundsQueryParams): Observable<ILocation[]> {
    return this._http.get<ILocation[]>(this._apiUrls.locations.getLocations, {
      params: params as any,
    });
  }

  getLocationDetails(id: number): Observable<ILocation> {
    return this._http.get<ILocation>(this._apiUrls.locations.getLocation(id));
  }

  postReport(report: IReport): Observable<void> {
    return this._http.post<void>(this._apiUrls.reports.postReport, report);
  }

  addFavourite(id: number): Observable<any> {
    return this._http.post(this._apiUrls.locations.favourite(id), {});
  }

  removeFavourite(id: number): Observable<any> {
    return this._http.delete(this._apiUrls.locations.favourite(id));
  }

  getLocationReviews(id: number): Observable<IReview[]> {
    return this._http.get<IReview[]>(this._apiUrls.reviews.locationReviews(id));
  }

  getMyReview(id: number): Observable<IReview> {
    return this._http.get<IReview>(this._apiUrls.reviews.myReview(id));
  }
}
