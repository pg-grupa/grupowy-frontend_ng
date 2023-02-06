import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, forkJoin, Subscription, take } from 'rxjs';
import { IMapState } from '../interfaces/map-state';
import { ILocationType } from '../models/location-type';
import { APIService } from './api.service';
import { LoggerService } from './logger.service';
import { MapService } from './map.service';
import { ILocationQueryParams } from '../interfaces/location-query-params';
import { IMapEvent, MapEventType, MoveEndEvent } from '../interfaces/map-event';

@Injectable()
export class FilteringService implements OnDestroy {
  private _locationTypes: ILocationType[] = [];

  private _mapServiceSubscription: Subscription;

  constructor(
    private _logger: LoggerService,
    private _api: APIService,
    private _map: MapService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._map.mapState$.pipe(take(1)).subscribe((state: IMapState) => {
      this._updateQueryParams(state);
      this._loadLocations(state);
    });

    this._mapServiceSubscription = this._map.mapEvents$
      .pipe(filter((event) => event.type === MapEventType.MoveEnd))
      .subscribe((event: IMapEvent) => {
        this._updateQueryParams(event.state!);
        this._loadLocations(event.state!);
      });
  }

  ngOnDestroy(): void {
    this._mapServiceSubscription.unsubscribe();
    this._logger.debug('FilteringService', 'OnDestroy');
  }

  private _updateQueryParams(mapState: IMapState) {
    const params = {
      zoom: mapState.zoom,
      lat: mapState.center.lat,
      lng: mapState.center.lng,
    };
    this._router.navigate([], {
      relativeTo: this._route,
      replaceUrl: true,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
    this._logger.debug('FilteringService', 'Updating query params', params);
  }

  private _loadLocations(mapState: IMapState) {
    const query: ILocationQueryParams = {
      longitude__gte: mapState.bounds.getWest(),
      longitude__lt: mapState.bounds.getEast(),
      latitude__gte: mapState.bounds.getSouth(),
      latitude__lt: mapState.bounds.getNorth(),
    };
    this._logger.debug('FilteringService', 'Loading locations');
    this._api.getLocations(query).subscribe((locations) => {
      this._map.drawLocationsMarkers(locations);
    });
  }

  setTypes(locationTypes: ILocationType[]): void {
    this._locationTypes = locationTypes;
  }

  getLocationType(id: number) {
    return this._locationTypes.find((locationType) => locationType.id === id);
  }
}
