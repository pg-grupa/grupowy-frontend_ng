import { trigger, transition, style, useAnimation } from '@angular/animations';
import { fadeIn } from './fade-in';
import { fadeOut } from './fade-out';

type params = {
  from?: string;
  to?: string;
  duration?: string;
  position?: string;
};

export function fadeInOutTrigger(params?: params) {
  const animationParams = {
    from: '100%, 0',
    to: '-100%, 0',
    duration: '375ms',
    position: 'relative',
    ...params,
  };
  return trigger('fadeInOut', [
    transition(':enter', [
      style({ position: animationParams.position }),
      useAnimation(fadeIn, { params: animationParams }),
    ]),
    transition(':leave', [
      style({ position: animationParams.position }),
      useAnimation(fadeOut, { params: animationParams }),
    ]),
  ]);
}
