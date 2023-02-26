import { animate, animation, style } from '@angular/animations';

/**
 * Fade out animation.
 * ```
 *  defaultParams = {
      to: '0, 0',
      duration: '375ms',
    }
 * ```
 *
 * Example usage:
 * ```
 * useAnimation(fadeOut, { params: { to: '-50%, 0' } }),
 * ```
 */
export const fadeOut = animation(
  [
    style({ transform: 'none', opacity: 1 }),
    animate(
      '{{ duration }}',
      style({ transform: 'translate({{ to }})', opacity: 0 })
    ),
  ],
  {
    params: {
      to: '0, 0',
      duration: '375ms',
    },
  }
);
