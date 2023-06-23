import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _notifications: NotificationService,
    private _authService: AuthService
  ) {}

  private _showNotification(response: HttpErrorResponse) {
    if (response.error.message) {
      this._notifications.error(response.error.message, 5000);
    } else {
      this._notifications.error(`${response.statusText}`, 0, response.message);
    }
  }

  /** Functions called according to error code, 'default' used for not declared codes */
  private _handlers: { [key: string]: Function } = {
    0: (response: HttpErrorResponse) => {
      // Connection errors
      // Navigate to general error page
      // this._showNotification(response);
      this._router.navigate(['/error/0'], { skipLocationChange: true });
    },
    400: (response: HttpErrorResponse) => {
      // Most probably form error
      // Handle by components with forms
    },
    401: (response: HttpErrorResponse) => {
      // Unauthorized
      this._router.navigate([{ outlets: { auth: ['account', 'auth'] } }], {
        queryParamsHandling: 'preserve',
      });
    },
    403: (response: HttpErrorResponse) => {
      // Forbidden
      if (this._authService.isAuthenticated) {
        this._authService.getLogout().subscribe(() => {
          this._router.navigate([{ outlets: { auth: ['account', 'auth'] } }], {
            queryParamsHandling: 'preserve',
          });
          this._showNotification(response);
        });
      }
    },
    404: (response: HttpErrorResponse) => {
      // Navigate to NotFound page
      this._router.navigate(['/error/404'], { skipLocationChange: true });
    },
    default: (response: HttpErrorResponse) => {
      // Default handler
      // For all other codes, show error notification
      this._showNotification(response);
    },
  };

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        // Get handler for corresponding error code or default handler
        let status: string = response.status.toString();
        let handler = this._handlers[status] || this._handlers['default'];

        // Run error handler
        handler(response);

        // Throw error for next HttpHandler
        throw response;
      })
    );
  }
}
