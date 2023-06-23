import { inject, Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { IReview } from '../models/review';
import { APIService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LocationReviewsResolver implements Resolve<IReview[]> {
  constructor(private _apiService: APIService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IReview[]> {
    const id = +route.paramMap.get('id')!;

    return this._apiService.getLocationReviews(id).pipe(
      map((reviews) => {
        return reviews.map((review) => {
          // review.created = new Date(review.created);
          return review;
        });
      })
    );
  }
}
