import { animate, animation, style } from '@angular/animations';

/**
 * Slide in animation.
 * ```
 *  params: {
 *    from: '<x>, <y>',
 *    duration: '<time>' // (optional) default: '375ms'
 *  }
 * ```
 *
 * Example usage:
 * ```
 * useAnimation(slideIn, { params: { from: '-50%, 0' } }),
 * ```
 */
export const slideIn = animation(
  [
    style({ transform: 'translate({{ from }})' }),
    animate('{{ duration }}', style({ transform: 'none' })),
  ],
  { params: { duration: '375ms' } }
);
