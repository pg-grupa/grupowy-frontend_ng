import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const _router = inject(Router);
  const _authService = inject(AuthService);
  return _authService.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        _router.navigate([{ outlets: { auth: ['account', 'auth'] } }], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
      return true;
    })
  );
};

export const canActivateChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => canActivate(route, state);
