import {
  animate,
  group,
  query,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { fadeIn } from 'src/app/shared/animations/fade/fade-in';
import { fadeOut } from 'src/app/shared/animations/fade/fade-out';

@Component({
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        useAnimation(fadeIn, { params: { from: '0, 100%' } }),
      ]),
      transition(':leave', [
        group([
          // inner router stays in DOM for duration of animation
          query(':leave', [animate('375ms')], { optional: true }),
          useAnimation(fadeOut, { params: { to: '0, 100%' } }),
        ]),
      ]),
    ]),
  ],
})
export class ReportPageComponent {
  constructor(private _router: Router) {}

  close() {
    this._router.navigate([{ outlets: { foreground: null } }], {
      queryParamsHandling: 'preserve',
    });
  }
}
