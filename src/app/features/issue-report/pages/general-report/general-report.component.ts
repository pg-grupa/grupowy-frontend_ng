import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { APIService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.scss'],
})
export class GeneralReportComponent {
  maxLength: number = 512;
  length: number = 0;
  errorMessages: string[] = [];

  form: FormGroup = this._fb.group({
    message: this._fb.control('', [
      Validators.required,
      Validators.maxLength(this.maxLength),
    ]),
  });

  public get fc() {
    return this.form.controls;
  }

  constructor(
    private _fb: FormBuilder,
    private _apiService: APIService,
    private _router: Router,
    private _notifications: NotificationService
  ) {}

  countLength() {
    this.length = this.form.controls['message'].value.length;
  }

  submit() {
    this._apiService
      .postReport(this.form.value)
      .pipe(
        catchError((httpError) => {
          if (httpError instanceof HttpErrorResponse) {
            if (typeof httpError.error === 'string') {
              this.errorMessages = [httpError.error];
            } else {
              this.errorMessages = [];
              for (const key in httpError.error) {
                this.form.controls[key]?.setErrors({
                  server: httpError.error[key],
                });
              }

              if ('NON_FIELD_ERRORS' in httpError.error) {
                this.errorMessages = httpError.error.NON_FIELD_ERRORS;
              }
            }
          }
          throw httpError;
        })
      )
      .subscribe(() => {
        this._notifications.success('Thank you for your feedback!', 5000);
        this._router.navigate([{ outlets: { report: null } }], {
          queryParamsHandling: 'preserve',
        });
      });
  }
}
