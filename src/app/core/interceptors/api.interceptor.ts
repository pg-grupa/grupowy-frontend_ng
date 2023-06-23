import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // append bearer token if user authenticated
    if (this._authService.isAuthenticated) {
      const token = this._authService.getUser()?.token!;
      headers['authorization'] = `Bearer ${token}`;
    }
    const apiRequest = request.clone({
      url: `${environment.apiUrl}${request.url}`,
      setHeaders: headers,
      // withCredentials: true,
    });

    return next.handle(apiRequest);
  }
}
