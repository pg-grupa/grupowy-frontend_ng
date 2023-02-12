import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  forkJoin,
  mergeMap,
  Observable,
  Subscription,
  take,
  tap,
} from 'rxjs';
import { IMapState } from '../../../core/interfaces/map-state';
import { ILocationType } from '../../../core/models/location-type';
import { APIService } from '../../../core/services/api.service';
import { LoggerService } from '../../../core/services/logger.service';
import { MapService } from '../../../core/services/map.service';
import {
  IBoundsQueryParams,
  IRadiusQueryParams,
} from '../../../core/interfaces/location-query-params';
import {
  IMapEvent,
  MapEventType,
  MoveEndEvent,
} from '../../../core/interfaces/map-event';
import { CacheService } from '../../../core/services/cache.service';
import { Mode } from '../enums/mode';
import { IFilterQuery } from '../interfaces/filter-query';

@Injectable()
export class FilteringService implements OnDestroy {
  private _modeSubject = new BehaviorSubject<Mode>(Mode.None);
  mode$ = this._modeSubject.asObservable();

  private _querySubject = new BehaviorSubject<IFilterQuery>({});
  query$ = this._querySubject.asObservable();

  private _mapServiceSubscription?: Subscription;

  constructor(
    private _logger: LoggerService,
    private _api: APIService,
    private _map: MapService,
    private _cache: CacheService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        this._initService();
      });
  }

  ngOnDestroy(): void {
    if (this._mapServiceSubscription)
      this._mapServiceSubscription.unsubscribe();
    this._logger.debug('FilteringService', 'OnDestroy');
  }

  get mode(): Mode {
    return this._modeSubject.value;
  }

  get query(): IFilterQuery {
    return this._querySubject.value;
  }

  private _initService() {
    this._logger.debug('FilteringService', 'Initializing.');
    const params = this._route.snapshot.queryParamMap;
    let queryTypes: number[] = [];
    if (params.has('type')) {
      let paramTypes = params.getAll('type')!;
      paramTypes.forEach((paramType) => {
        const type = +paramType;
        if (!isNaN(type)) {
          queryTypes.push(type);
        }
      });
    }
    if (queryTypes.length > 0) {
      this.filterByTypes(queryTypes);
    } else {
      this.filterAll();
    }

    this._mapServiceSubscription = this._map.mapEvents$
      .pipe(filter((event: IMapEvent) => event.type === MapEventType.MoveEnd))
      .subscribe((event) => {
        if (this.mode === Mode.All || this.mode === Mode.Types) {
          this._loadByBounds(event.state!, this.query.type).subscribe();
        }
      });
  }

  private _loadByBounds(mapState: IMapState, types?: number[]) {
    const query: IBoundsQueryParams = {
      longitude__gte: mapState.bounds.getWest(),
      longitude__lt: mapState.bounds.getEast(),
      latitude__gte: mapState.bounds.getSouth(),
      latitude__lt: mapState.bounds.getNorth(),
    };
    if (types && types.length > 0) {
      query.type = types;
    }
    this._logger.debug('FilteringService', 'Loading by bounds', query);
    return this._api.getLocations(query).pipe(
      tap((locations) => {
        this._map.drawLocationsMarkers(locations);
      })
    );
  }

  filterAll() {
    this._logger.debug('FilteringService', 'No filters active.');
    this._loadByBounds(this._map.getState()).subscribe((locations) => {
      this._modeSubject.next(Mode.All);
      this._querySubject.next({});
      this._updateLocation();
    });
  }

  filterByTypes(types?: number[]) {
    this._logger.debug('FilteringService', 'Filtering by types: ', types);
    this._loadByBounds(this._map.getState(), types).subscribe((locations) => {
      this._modeSubject.next(Mode.Types);
      this._querySubject.next({
        type: types,
      });
      this._updateLocation();
    });
  }

  private _loadRadius(): void {}

  resetFilters(): void {
    this._logger.debug('FilteringService', 'Resetting filters.');
    this.filterAll();
  }

  private _updateLocation() {
    let params = {
      type: undefined,
      radius: undefined,
      longitude: undefined,
      latitude: undefined,
      ...this.query,
    };
    this._router.navigate([], {
      relativeTo: this._route,
      replaceUrl: true,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
