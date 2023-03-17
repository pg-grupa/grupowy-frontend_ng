import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const NO_LOADING = new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loading: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.context.get(NO_LOADING) === true) return next.handle(request);

    this.loading.start();
    return next.handle(request).pipe(
      finalize(() => {
        this.loading.stop();
      })
    );
  }
}
