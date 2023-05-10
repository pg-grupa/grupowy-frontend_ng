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
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LocationMyReviewResolver implements Resolve<IReview | undefined> {
  constructor(
    private _apiService: APIService,
    private authService: AuthService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IReview | undefined> {
    const id = +route.paramMap.get('id')!;

    if (!this.authService.isAuthenticated) return of(undefined);

    return this._apiService.getMyReview(id);
  }
}
