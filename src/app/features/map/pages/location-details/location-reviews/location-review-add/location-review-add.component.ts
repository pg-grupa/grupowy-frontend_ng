import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ILocationFull } from 'src/app/core/models/location';
import { APIService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormBaseComponent } from 'src/app/shared/components/forms/form-base.component';

@Component({
  templateUrl: './location-review-add.component.html',
  styleUrls: ['./location-review-add.component.scss'],
})
export class LocationReviewAddComponent
  extends FormBaseComponent
  implements OnInit
{
  maxLength: number = 512;
  location!: ILocationFull;

  override form: FormGroup = this._fb.group({
    score: this._fb.control(0, [Validators.min(1), Validators.max(5)]),
    text: this._fb.control('', [
      Validators.maxLength(this.maxLength),
      Validators.required,
    ]),
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
    });
  }

  saveReview(): void {
    if (!this.form.invalid) {
      this._apiService
        .createReview(this.location.id, this.form.value)
        .pipe(this.onSubmit)
        .subscribe((response) => {
          this._notifications.success('Review created successfully.');
          this._router.navigate(['../'], {
            relativeTo: this._route,
            queryParamsHandling: 'preserve',
          });
        });
    }
  }
}
