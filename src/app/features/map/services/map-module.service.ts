import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { IMapState } from 'src/app/core/interfaces/map-state';
import { ILocation, ILocationFull } from 'src/app/core/models/location';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';
import { CacheService } from 'src/app/core/services/cache.service';
import { parseBoundsToQuery } from 'src/app/core/interfaces/location-query-params';

@Injectable({
  providedIn: 'root',
})
export class MapModuleService {
  /** Subject of currently loaded locations. */
  private _locationsSubject: ReplaySubject<ILocation[]>;
  /** Observable of currently loaded locations. @return {ILocation[]} */
  readonly locations$;

  /** Subject of currently selected location. */
  private _selectedLocationSubject: BehaviorSubject<ILocationFull | null>;
  /** Observable of currently selected location. @return {ILocationFull | null} */
  readonly selectedLocation$;

  /** Subject of currently selected coordinates. */
  private _selectedCoordinatesSubject: BehaviorSubject<L.LatLng | null>;
  /** Observable of currently selected coordinates. @return {L.LatLng | null} */
  readonly selectedCoordinates$;

  /** Subject of currently selected types. */
  private _selectedTypesSubject: BehaviorSubject<number[]>;
  /** Observable of currently selected types. @return {number[]} */
  readonly selectedTypes$;

  private _movestartSubject: Subject<void> = new Subject<void>();
  readonly movestart$ = this._movestartSubject.asObservable();

  /**
   * When fired, map in {@link MapPageComponent} pans to provided coordinates.
   */
  readonly flyTo$;
  private _flyToSubject: Subject<{ latLng: L.LatLng; zoom: number }>;

  /**
   * Store current state of map from {@link MapPageComponent},
   * when MapPageComponent is reinstantiated, it will be set to this state.
   * Initial state loaded from {@link environment}.
   */
  private _mapState: IMapState = {
    zoom: environment.initMapConfig.zoom,
    center: new L.LatLng(
      environment.initMapConfig.lat,
      environment.initMapConfig.lng
    ),
    bounds: undefined,
  };

  /** @constructor */
  constructor(private _cacheService: CacheService) {
    // Initialize subjects and observables
    this._locationsSubject = new ReplaySubject<ILocation[]>(1);
    this.locations$ = this._locationsSubject.asObservable();

    this._selectedLocationSubject = new BehaviorSubject<ILocationFull | null>(
      null
    );
    this.selectedLocation$ = this._selectedLocationSubject.asObservable();

    this._selectedCoordinatesSubject = new BehaviorSubject<L.LatLng | null>(
      null
    );
    this.selectedCoordinates$ = this._selectedCoordinatesSubject.asObservable();

    this._selectedTypesSubject = new BehaviorSubject<number[]>([]);
    this.selectedTypes$ = this._selectedTypesSubject.asObservable();

    this._flyToSubject = new Subject<{ latLng: L.LatLng; zoom: number }>();
    this.flyTo$ = this._flyToSubject.asObservable();
  }

  get selectedTypes(): number[] {
    return this._selectedTypesSubject.value;
  }

  get zoom(): number {
    return this._mapState.zoom;
  }
  get center(): L.LatLng {
    return this._mapState.center;
  }
  get bounds(): L.LatLngBounds | undefined {
    return this._mapState.bounds;
  }

  /** Refresh locations based on bounds and selected types */
  refreshLocations(): void {
    if (!this.bounds) return;

    const query = parseBoundsToQuery(this.bounds);
    if (this.selectedTypes.length) {
      query.type = this.selectedTypes;
    }

    this._cacheService.getLocations(query).subscribe((locations) => {
      this._locationsSubject.next(locations);
    });
  }

  selectTypes(types: number[], refreshLocations: boolean = true) {
    this._selectedTypesSubject.next(types);
    if (refreshLocations) this.refreshLocations();
  }

  clearSelectedTypes(refreshLocations: boolean = true) {
    this.selectTypes([], refreshLocations);
  }

  selectCoordinates(coords: L.LatLng) {
    this._selectedCoordinatesSubject.next(coords);
  }

  clearSelectedCoordinates() {
    this._selectedCoordinatesSubject.next(null);
  }

  selectLocation(location: ILocationFull) {
    this._selectedLocationSubject.next(location);
  }

  clearSelectedLocation() {
    this._selectedLocationSubject.next(null);
  }

  onBoundsChange(bounds: L.LatLngBounds, refreshLocations: boolean = true) {
    this._mapState.bounds = bounds;
    if (refreshLocations) this.refreshLocations();
  }

  onZoomChange(zoom: number, refreshLocations: boolean = false) {
    this._mapState.zoom = zoom;
    if (refreshLocations) this.refreshLocations();
  }

  onCenterChange(center: L.LatLng, refreshLocations: boolean = false) {
    this._mapState.center = center;
    if (refreshLocations) this.refreshLocations();
  }

  onMovestart() {
    this._movestartSubject.next();
  }

  flyTo(latLng: L.LatLng, zoom?: number): void {
    if (!zoom) zoom = this.zoom;
    this._flyToSubject.next({ latLng, zoom });
  }
}
