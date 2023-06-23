import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { ILocationFull } from 'src/app/core/models/location';
import { IReview } from 'src/app/core/models/review';
import { APIService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfirmationService } from 'src/app/core/services/confirmation.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  templateUrl: './location-reviews-list.component.html',
  styleUrls: ['./location-reviews-list.component.scss'],
})
export class LocationReviewsListComponent implements OnInit {
  location!: ILocationFull;
  reviews: IReview[] = [];
  myReview?: IReview;
  isAuthenticated$!: Observable<boolean>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _apiService: APIService,
    private _confirmationService: ConfirmationService,
    private _notificationsService: NotificationService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];
      this.refreshReviews();
    });

    // // Load myReview if/when user authenticates
    this.isAuthenticated$ = this._authService.isAuthenticated$;
  }

  deleteMyReview(): void {
    if (this.myReview) {
      this._confirmationService
        .ask(
          'Are you sure you want to delete this review?',
          'This action cannot be undone.',
          {
            btnClass: 'error',
            btnText: 'Delete',
            value: true,
          },
          {
            btnClass: 'primary',
            btnText: 'Cancel',
            value: false,
          }
        )
        .subscribe((toDelete) => {
          if (toDelete === true) {
            this._apiService
              .deleteMyReview(this.location.id, this.myReview!.id!)
              .subscribe(() => {
                this.myReview = undefined;
                this.refreshReviews();
                this._notificationsService.success(
                  'Review deleted successfully.'
                );
              });
          }
        });
    }
  }

  refreshReviews(): void {
    this._apiService
      .getLocationReviews(this.location.id)
      .subscribe((reviews) => {
        this.reviews = reviews;

        const user = this._authService.getUser();

        if (user) {
          this.myReview = reviews.find((review) => review.user_id === user.id);
        }
      });
  }
}
