import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class MapService {
  private _map?: L.Map;

  /**
   * Emits true when the map is done initializing.
   */
  public readonly ready$: Observable<boolean>;
  private _readySubject: ReplaySubject<boolean>;

  constructor() {
    this._readySubject = new ReplaySubject<boolean>(1);
    this.ready$ = this._readySubject.asObservable();
  }

  initMap(map: L.Map): void {
    this._map = map;
    this._readySubject.next(true);
  }

  addLayer(layer: L.Layer): void {
    this._map?.addLayer(layer);
  }

  removeLayer(layer: L.Layer): void {
    if (this._map && this._map.hasLayer(layer)) {
      this._map.removeLayer(layer);
    }
  }

  addControl(control: L.Control): void {
    this._map?.addControl(control);
  }

  removeControl(control: L.Control): void {
    if (this._map) {
      this._map.removeControl(control);
    }
  }

  flyToBounds(bounds: L.LatLngBoundsExpression): void {
    this._map!.flyToBounds(bounds);
  }
}
