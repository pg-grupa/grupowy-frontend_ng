import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
})
export class ReportPageComponent {
  constructor(private _router: Router) {}

  close() {
    this._router.navigate([{ outlets: { report: null } }], {
      queryParamsHandling: 'preserve',
    });
  }
}
