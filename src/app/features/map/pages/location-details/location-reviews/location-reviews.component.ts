import {
  trigger,
  transition,
  query,
  animateChild,
  group,
  animate,
  useAnimation,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { ILocationFull } from 'src/app/core/models/location';
import { IReview } from 'src/app/core/models/review';
import { APIService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfirmationService } from 'src/app/core/services/confirmation.service';
import { fadeIn } from 'src/app/shared/animations/fade/fade-in';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';
import { fadeOut } from 'src/app/shared/animations/fade/fade-out';

@Component({
  selector: 'app-location-reviews',
  templateUrl: './location-reviews.component.html',
  styleUrls: ['./location-reviews.component.scss'],
  animations: [
    fadeInOutTrigger('fadeInOut', {
      from: '0, 100%',
      to: '0, 100%',
      position: 'absolute',
    }),
  ],
})
export class LocationReviewsComponent {
  location!: ILocationFull;
  reviews: IReview[] = [];
  myReview?: IReview;
  loading: boolean = true;
  isAuthenticated: boolean = false;

  private _authServiceSubscription!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService
  ) {}

  // ngOnInit(): void {
  //   this._authServiceSubscription =
  //     this._authService.isAuthenticated$.subscribe((isAuthenticated) => {
  //       if (isAuthenticated) {
  //         this.isAuthenticated = true;
  //         this.refreshMyReview();
  //       } else {
  //         this.isAuthenticated = false;
  //         this.myReview = undefined;
  //       }
  //     });
  // }

  // ngOnDestroy(): void {
  //   this._authServiceSubscription.unsubscribe();
  // }

  // refreshMyReview(): void {
  //   this.loading = true;
  //   this._apiService
  //     .getMyReview(this.location.id)
  //     .pipe(
  //       finalize(() => {
  //         this.loading = false;
  //       })
  //     )
  //     .subscribe((myReview) => {
  //       if (myReview.id !== null) {
  //         this.myReview = myReview;
  //       } else {
  //         this.myReview = undefined;
  //       }
  //     });
  // }
}
