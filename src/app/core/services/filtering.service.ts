import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription, take } from 'rxjs';
import { IMapState } from '../interfaces/map-state';
import { ILocationType } from '../models/location-type';
import { APIService } from './api.service';
import { LoggerService } from './logger.service';
import { MapService } from './map.service';

@Injectable()
export class FilteringService implements OnDestroy {
  private _locationTypes: ILocationType[] = [];

  private _mapStateSubscription: Subscription;

  constructor(
    private _logger: LoggerService,
    private _api: APIService,
    private _map: MapService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._logger.debug('FilteringService', 'Initializing.');
    // forkJoin({
    //   locationTypes: this._api.getTypes(),
    //   queryParams: this._route.queryParams.pipe(take(1)),
    // }).subscribe(({ locationTypes, queryParams }) => {
    //   this._locationTypes = locationTypes;
    //   this._logger.debug(
    //     'FilteringService',
    //     'Location types:',
    //     this._locationTypes
    //   );

    //   this._logger.debug('FilteringService', 'Query params:', queryParams);
    // });

    this._mapStateSubscription = this._map.mapState$.subscribe(
      (state: IMapState) => {
        this._updateQueryParams(state);
      }
    );
  }

  ngOnDestroy(): void {
    this._mapStateSubscription.unsubscribe();
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
}
