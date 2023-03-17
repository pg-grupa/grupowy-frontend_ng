import {
  trigger,
  transition,
  style,
  useAnimation,
  animate,
  query,
  group,
} from '@angular/animations';
import { fadeIn } from './fade-in';
import { fadeOut } from './fade-out';

type params = {
  from?: string;
  to?: string;
  duration?: string;
  position?: string;
};

export function fadeInOutTrigger(name: string = 'fadeInOut', params?: params) {
  const animationParams = {
    from: '100%, 0',
    to: '-100%, 0',
    duration: '375ms',
    position: 'relative',
    ...params,
  };
  return trigger(name, [
    transition(':enter', [
      style({ position: animationParams.position }),
      useAnimation(fadeIn, { params: animationParams }),
    ]),
    transition(':leave', [
      style({ position: animationParams.position }),
      group([
        // inner router stays in DOM for duration of animation
        query(':leave', [animate('375ms')], { optional: true }),
        useAnimation(fadeOut, { params: animationParams }),
      ]),
    ]),
  ]);
}
