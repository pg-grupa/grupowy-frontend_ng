import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { IMapEvent, MapEventType } from '../interfaces/map-event';
import { IMapState } from '../interfaces/map-state';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapEventsSubject: Subject<IMapEvent> = new Subject();
  private mapStateSubject: ReplaySubject<IMapState> = new ReplaySubject(1);

  /* Emit map's new bounds everytime user stops moving in MapComponent */
  // public readonly mapBounds$ = this.mapBoundsSubject.asObservable();

  public readonly mapEvents$ = this.mapEventsSubject.asObservable();
  public readonly mapState$ = this.mapStateSubject.asObservable();

  constructor(private _logger: LoggerService) {}

  public onMapStateChange(mapState: IMapState) {
    this._logger.debug('MapService', 'Map state changed:', mapState);
    this.mapStateSubject.next(mapState);
  }

  public onMapEvent(mapEvent: IMapEvent): void {
    this._logger.debug(
      'MapService',
      `Map event: ${MapEventType[mapEvent.type]}`,
      mapEvent
    );
    this.mapEventsSubject.next(mapEvent);
    if ('state' in mapEvent) {
      this.onMapStateChange(mapEvent.state!);
    }
  }
}
