import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayerGroupService {
  private _layerGroup?: L.LayerGroup;

  private _readySubject: ReplaySubject<boolean>;
  readonly ready$: Observable<boolean>;

  constructor() {
    this._readySubject = new ReplaySubject(1);
    this.ready$ = this._readySubject.asObservable();
  }

  initLayer(layer: L.LayerGroup): void {
    this._layerGroup = layer;
    this._readySubject.next(true);
  }

  addLayer(layer: L.Layer): void {
    this._layerGroup?.addLayer(layer);
  }

  removeLayer(layer: L.Layer): void {
    if (this._layerGroup && this._layerGroup.hasLayer(layer)) {
      this._layerGroup?.removeLayer(layer);
    }
  }
}
