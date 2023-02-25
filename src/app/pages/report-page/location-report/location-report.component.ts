import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ILocationFull } from 'src/app/core/models/location';

@Component({
  templateUrl: './location-report.component.html',
  styleUrls: ['./location-report.component.scss'],
})
export class LocationReportComponent implements OnInit {
  maxLength: number = 512;
  length: number = 0;

  form: FormGroup = this._fb.group({
    location: this._fb.control(null, [Validators.required]),
    message: this._fb.control('', [Validators.required]),
  });

  location!: ILocationFull;

  constructor(private _route: ActivatedRoute, private _fb: FormBuilder) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.location = data['location'];
      this.form.patchValue({
        location: this.location.id,
      });
    });
  }

  countLength() {
    this.length = this.form.controls['message'].value.length;
  }

  submit() {
    console.log(this.form.value);

    throw new Error('Method not implemented.');

    // TODO
  }
}
