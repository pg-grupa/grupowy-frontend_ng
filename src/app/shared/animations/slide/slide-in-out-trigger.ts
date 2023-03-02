import { trigger, transition, style, useAnimation } from '@angular/animations';
import { slideIn } from './slide-in';
import { slideOut } from './slide-out';

export const slideInOutTrigger = trigger('slideInOut', [
  transition(':enter', [
    style({ position: 'absolute' }),
    useAnimation(slideIn, { params: { from: '100%, 0' } }),
  ]),
  transition(':leave', [
    style({ position: 'absolute' }),
    useAnimation(slideOut, { params: { to: '-100%, 0' } }),
  ]),
]);
