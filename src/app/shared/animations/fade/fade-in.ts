import { animate, animation, style } from '@angular/animations';

/**
 * Fade in animation.
 * ```
 *  defaultParams = {
      from: '0, 0',
      duration: '375ms',
    }
 * ```
 *
 * Example usage:
 * ```
 * useAnimation(fadeIn, { params: { from: '-50%, 0' } }),
 * ```
 */
export const fadeIn = animation(
  [
    style({ transform: 'translate({{ from }})', opacity: 0 }),
    animate('{{ duration }}', style({ transform: 'none', opacity: 1 })),
  ],
  {
    params: {
      from: '0, 0',
      duration: '375ms',
    },
  }
);
