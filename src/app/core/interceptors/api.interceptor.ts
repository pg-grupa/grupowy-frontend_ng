import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apiRequest = request.clone({
      url: `${environment.apiUrl}${request.url}`,
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return next.handle(apiRequest);
  }
}
