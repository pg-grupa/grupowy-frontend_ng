import { trigger, transition, style, useAnimation } from '@angular/animations';
import { fadeIn } from './fade-in';
import { fadeOut } from './fade-out';

type params = {
  from?: string;
  to?: string;
  duration?: string;
};

export function fadeInOutTrigger(params?: params) {
  const animationParams = {
    from: '100%, 0',
    to: '-100%, 0',
    duration: '375ms',
    ...params,
  };
  return trigger('fadeInOut', [
    transition(':enter', [
      style({ position: 'relative' }),
      useAnimation(fadeIn, { params: animationParams }),
    ]),
    transition(':leave', [
      style({ position: 'relative' }),
      useAnimation(fadeOut, { params: animationParams }),
    ]),
  ]);
}
