import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// TODO: Add link to this component (in 'About' page?)
@Component({
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.scss'],
})
export class GeneralReportComponent {
  maxLength: number = 512;
  length: number = 0;

  form: FormGroup = this._fb.group({
    message: this._fb.control('', [Validators.required]),
  });

  constructor(private _fb: FormBuilder) {}

  countLength() {
    this.length = this.form.controls['message'].value.length;
  }

  submit() {
    console.log(this.form.value);

    throw new Error('Method not implemented.');

    // TODO
  }
}
