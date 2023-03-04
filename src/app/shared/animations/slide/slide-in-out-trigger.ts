import { trigger, transition, style, useAnimation } from '@angular/animations';
import { slideIn } from './slide-in';
import { slideOut } from './slide-out';

type params = {
  from?: string;
  to?: string;
  duration?: string;
};

export function slideInOutTrigger(params?: params) {
  const animationParams = {
    from: '100%, 0',
    to: '-100%, 0',
    duration: '375ms',
    ...params,
  };
  return trigger('slideInOut', [
    transition(':enter', [
      style({ position: 'absolute' }),
      useAnimation(slideIn, { params: animationParams }),
    ]),
    transition(':leave', [
      style({ position: 'absolute' }),
      useAnimation(slideOut, { params: animationParams }),
    ]),
  ]);
}
