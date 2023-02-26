import { animate, animation, style } from '@angular/animations';

/**
 * Slide out animation.
 * ```
 *  params: {
 *    to: '<x>, <y>',
 *    duration: '<time>' // (optional) default: '375ms'
 *  }
 * ```
 *
 * Example usage:
 * ```
 * useAnimation(slideOut, { params: { to: '-50%, 0' } }),
 * ```
 */
export const slideOut = animation(
  [
    style({ transform: 'translate(0, 0)' }),
    animate('{{ duration }}', style({ transform: 'translate({{ to }})' })),
  ],
  { params: { duration: '375ms' } }
);
