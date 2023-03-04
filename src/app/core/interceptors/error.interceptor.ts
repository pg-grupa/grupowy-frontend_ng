import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationsService } from '../services/notifications.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _notifications: NotificationsService
  ) {}

  private _showNotification(response: HttpErrorResponse) {
    this._notifications.error(`Error ${response.status}`, 0, response.message);
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
    404: (response: HttpErrorResponse) => {
      // Navigate to NotFound page
      this._router.navigate(['/error'], { skipLocationChange: true });
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
