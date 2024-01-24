import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { IBoundsQueryParams } from '../interfaces/location-query-params';
import { IUser } from '../models/user';
import {
  IFavouriteLocation,
  ILocation,
  ILocationFull,
} from '../models/location';
import { ILocationType } from '../models/location-type';
import { IReport } from '../models/report';
import { IReview } from '../models/review';
import { NO_LOADING } from '../interceptors/loading.interceptor';
import { IPlaceService } from '../models/location-service';

/** Service responsible for api requests. */
@Injectable({
  providedIn: 'root',
})
export class APIService {
  /** API urls used by this service. */
  private _apiUrls = {
    locations: {
      getTypes: 'serviceTypes/',
      getLocations: 'locations/',
      getLocation: (id: number): string => `location/${id}/details/`,
      getLocationServices: (id: number): string => `location/${id}/services/`,
      favourite: 'favourite-locations/',
    },
    reports: {
      postReport: 'report/',
    },
    reviews: {
      locationReviews: (id: number) => `location/${id}/reviews`,
      createReview: (id: number) => `reviews/location/${id}/create/`,
      myReview: (id: number, review_id: number) =>
        `location/${id}/reviews/${review_id}`,
    },
  };

  /** @constructor */
  constructor(private _http: HttpClient) {}

  /** Returns observable of all location types. */
  getTypes(): Observable<ILocationType[]> {
    return this._http.get<ILocationType[]>(this._apiUrls.locations.getTypes);
  }

  /** Returns observable of locations meeting the given query params. */
  getLocations(
    params: IBoundsQueryParams,
    noLoading: boolean = false
  ): Observable<ILocation[]> {
    return this._http.get<ILocation[]>(this._apiUrls.locations.getLocations, {
      context: new HttpContext().set(NO_LOADING, noLoading),
      params: params as any,
    });
  }

  getFilteredLocations(params: any): Observable<ILocation[]> {
    params['lat1'] = 0;
    params['lat2'] = 1000;
    params['lng1'] = 0;
    params['lng2'] = 1000;
    return this._http.get<ILocation[]>(this._apiUrls.locations.getLocations, {
      params: params as any,
    });
  }

  getLocationDetails(id: number): Observable<ILocationFull> {
    return this._http.get<ILocationFull>(
      this._apiUrls.locations.getLocation(id)
    );
  }

  getLocationServices(id: number): Observable<IPlaceService[]> {
    return this._http.get<IPlaceService[]>(
      this._apiUrls.locations.getLocationServices(id)
    );
  }

  postReport(report: IReport): Observable<void> {
    return this._http.post<void>(this._apiUrls.reports.postReport, report);
  }

  getFavourites(): Observable<IFavouriteLocation[]> {
    return this._http
      .get<{ data: IFavouriteLocation[] }>(this._apiUrls.locations.favourite)
      .pipe(map((response) => response.data));
  }

  addFavourite(id: number): Observable<any> {
    return this._http.put(this._apiUrls.locations.favourite, {
      location_id: id,
    });
  }

  removeFavourite(id: number): Observable<any> {
    return this._http.delete(this._apiUrls.locations.favourite, {
      body: { location_id: id },
    });
  }

  getLocationReviews(id: number): Observable<IReview[]> {
    return this._http.get<any>(this._apiUrls.reviews.locationReviews(id)).pipe(
      map((response) => {
        return response.data.reviews;
      })
    );
  }

  createReview(
    id: number,
    review: { rating: number; text: string }
  ): Observable<IReview> {
    return this._http.post<IReview>(
      this._apiUrls.reviews.locationReviews(id),
      review
    );
  }

  getMyReview(id: number): Observable<IReview | undefined> {
    return this._http
      .get<IReview>(this._apiUrls.reviews.myReview(id, 0), {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          // if status HTTP_204_NO_CONTENT (no review for location) return undefined
          if (response.status === 204) return undefined;

          // otherwise return review
          return response.body!;
        })
      );
  }

  updateMyReview(
    id: number,
    review_id: number,
    review: { rating: number; text: string }
  ): Observable<IReview> {
    return this._http.put<IReview>(
      this._apiUrls.reviews.myReview(id, review_id),
      review
    );
  }

  deleteMyReview(id: number, review_id: number): Observable<void> {
    return this._http.delete<void>(
      this._apiUrls.reviews.myReview(id, review_id)
    );
  }
}
