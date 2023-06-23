import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ILocationFull } from 'src/app/core/models/location';
import { IReview } from 'src/app/core/models/review';
import { APIService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormBaseComponent } from 'src/app/shared/components/forms/form-base.component';

@Component({
  templateUrl: './location-review-edit.component.html',
  styleUrls: ['./location-review-edit.component.scss'],
})
export class LocationReviewEditComponent
  extends FormBaseComponent
  implements OnInit
{
  maxLength: number = 512;
  location!: ILocationFull;

  override form: FormGroup = this._fb.group({
    rating: this._fb.control(0, [Validators.min(1), Validators.max(5)]),
    text: this._fb.control('', [Validators.maxLength(this.maxLength)]),
  });

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notifications: NotificationService,
    private _apiService: APIService
  ) {
    super();
  }

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];
      const review: IReview = data['myReview'];
      this.form.setValue({
        rating: review.score,
        text: review.text,
      });
    });
  }

  saveReview(): void {
    if (!this.form.invalid) {
      this._apiService
        .updateMyReview(this.location.id, 0, this.form.value)
        .pipe(this.onSubmit)
        .subscribe((response) => {
          this._notifications.success('Review updated successfully.');
          this._router.navigate(['../'], {
            relativeTo: this._route,
            queryParamsHandling: 'preserve',
          });
        });
    }
  }
}
