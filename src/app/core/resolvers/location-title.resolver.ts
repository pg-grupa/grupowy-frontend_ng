import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationTitleResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return of(route.parent?.data['location'].name);
  }
}
