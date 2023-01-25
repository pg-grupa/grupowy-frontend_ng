import { Injectable } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapBoundsSubject: ReplaySubject<LatLngBounds> = new ReplaySubject(1);

  /* Emit map's new bounds everytime user stops moving in MapComponent */
  public readonly mapBounds$ = this.mapBoundsSubject.asObservable();

  constructor() {}

  public onBoundsChanged(bounds: LatLngBounds) {
    this.mapBoundsSubject.next(bounds);
  }
}
