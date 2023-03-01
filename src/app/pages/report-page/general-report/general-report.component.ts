import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { APIService } from 'src/app/core/services/api.service';

// TODO: Add link to this component (in 'About' page?)
@Component({
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.scss'],
})
export class GeneralReportComponent {
  maxLength: number = 512;
  length: number = 0;
  success: boolean = false;
  errorMessages: string[] = [];

  form: FormGroup = this._fb.group({
    message: this._fb.control('', [Validators.required]),
  });

  public get fc() {
    return this.form.controls;
  }

  constructor(private _fb: FormBuilder, private _apiService: APIService) {}

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
      .subscribe(() => (this.success = true));
  }
}
