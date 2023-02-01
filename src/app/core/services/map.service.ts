import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IMapEvent, MapEventType } from '../interfaces/map-event';
import { APIService } from './api.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  // private mapBoundsSubject: ReplaySubject<LatLngBounds> = new ReplaySubject(1);
  private mapEventsSubject: Subject<IMapEvent> = new Subject();

  /* Emit map's new bounds everytime user stops moving in MapComponent */
  // public readonly mapBounds$ = this.mapBoundsSubject.asObservable();

  public readonly mapEvents$ = this.mapEventsSubject.asObservable();

  constructor(private _api: APIService, private _logger: LoggerService) {}

  public newMapEvent(mapEvent: IMapEvent): void {
    this._logger.debug(
      'MapService',
      `Map event: ${MapEventType[mapEvent.type]}`,
      mapEvent
    );
    this.mapEventsSubject.next(mapEvent);
  }
}
