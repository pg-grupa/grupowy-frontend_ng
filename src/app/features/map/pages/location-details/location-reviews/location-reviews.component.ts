import { trigger, transition, query, animateChild } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { ILocationFull } from 'src/app/core/models/location';
import { IReview } from 'src/app/core/models/review';
import { APIService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';

@Component({
  selector: 'app-location-reviews',
  templateUrl: './location-reviews.component.html',
  styleUrls: ['./location-reviews.component.scss'],
  animations: [
    fadeInOutTrigger({ from: '0, 100%', to: '0, 100%', position: 'absolute' }),
    trigger('fadeInOutOuter', [
      transition(':enter', [query('@*', [animateChild()], { optional: true })]),
      transition(':leave', [query('@*', [animateChild()], { optional: true })]),
    ]),
  ],
  host: {
    '[@fadeInOutOuter]': '',
  },
})
export class LocationReviewsComponent implements OnInit, OnDestroy {
  location!: ILocationFull;
  reviews: IReview[] = [];
  myReview?: IReview;
  loading: boolean = true;
  isAuthenticated: boolean = false;

  private _authServiceSubscription!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _apiService: APIService
  ) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];
      this.reviews = data['reviews'];
    });
    this._authServiceSubscription =
      this._authService.isAuthenticated$.subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.isAuthenticated = true;
          this.refreshMyReview();
        } else {
          this.isAuthenticated = false;
          this.myReview = undefined;
        }
      });
  }

  ngOnDestroy(): void {
    this._authServiceSubscription.unsubscribe();
  }

  refreshMyReview(): void {
    this.loading = true;
    this._apiService
      .getMyReview(this.location.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((myReview) => {
        if (myReview.id !== null) {
          this.myReview = myReview;
        } else {
          this.myReview = undefined;
        }
      });
  }
}
