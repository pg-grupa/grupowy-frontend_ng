import {
  animate,
  animateChild,
  group,
  query,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { Component } from '@angular/core';
import { fadeIn } from 'src/app/shared/animations/fade/fade-in';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';
import { fadeOut } from 'src/app/shared/animations/fade/fade-out';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
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
export class AccountComponent {}
