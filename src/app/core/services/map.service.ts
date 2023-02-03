import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { IMapCommand, MapCommandType } from '../interfaces/map-commands';
import { IMapEvent, MapEventType } from '../interfaces/map-event';
import { IMapState } from '../interfaces/map-state';
import { ILocation } from '../models/location';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _mapEventsSubject: Subject<IMapEvent> = new Subject();
  private _mapCommandsSubject: Subject<IMapCommand> = new Subject();
  private _mapStateSubject: ReplaySubject<IMapState> = new ReplaySubject(1);

  /* Emit map's new bounds everytime user stops moving in MapComponent */
  // public readonly mapBounds$ = this.mapBoundsSubject.asObservable();

  public readonly mapEvents$ = this._mapEventsSubject.asObservable();
  public readonly mapCommands$ = this._mapCommandsSubject.asObservable();
  public readonly mapState$ = this._mapStateSubject.asObservable();

  constructor(private _logger: LoggerService) {
    this._logger.debug('MapService', 'Instantiated.');
  }

  public onMapStateChange(mapState: IMapState) {
    this._logger.debug('MapService', 'Map state changed:', mapState);
    this._mapStateSubject.next(mapState);
  }

  public onMapEvent(mapEvent: IMapEvent): void {
    this._logger.debug(
      'MapService',
      `Map event: ${MapEventType[mapEvent.type]}`,
      mapEvent
    );
    this._mapEventsSubject.next(mapEvent);
    if ('state' in mapEvent) {
      this.onMapStateChange(mapEvent.state!);
    }
  }

  public clearMarkers() {
    this._logger.debug('MapService', 'Clearing markers.');
    this._mapCommandsSubject.next({
      type: MapCommandType.ClearMarkers,
    });
  }

  public addLocationsMarkers(locations: ILocation[]) {
    this._logger.debug('MapService', 'Adding markers.', locations);
    this._mapCommandsSubject.next({
      type: MapCommandType.AddLocationsMarkers,
      payload: locations,
    });
  }
}
