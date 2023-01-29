import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  private _loadingNumber = 0;

  public readonly loading$ = this._loading.asObservable();

  constructor() {}

  isLoading() {
    return this._loading.value;
  }

  start() {
    this._loadingNumber++;

    // no need to emit if already in loading state
    if (!this._loading.value) {
      this._loading.next(true);
    }
  }

  stop() {
    this._loadingNumber--;
    if (this._loadingNumber === 0) {
      this._loading.next(false);
    }
  }

  reset() {
    this._loadingNumber = 0;
    this._loading.next(false);
  }
}
