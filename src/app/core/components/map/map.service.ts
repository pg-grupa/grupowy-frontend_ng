import { Injectable, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-extra-markers';
import 'leaflet.markercluster';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { MapMode } from '../../enums/settings';
import { SettingsService } from '../../services/settings.service';

@Injectable()
export class MapService implements OnDestroy {
  private _map?: L.Map;

  private _markersGroup: L.FeatureGroup;
  private _clusterGroup: L.MarkerClusterGroup;

  private _auxGroup: L.FeatureGroup;

  private _mode!: MapMode;
  get mode(): MapMode {
    return this._mode;
  }

  /**
   * Emits true when the map is done initializing.
   */
  public readonly ready$: Observable<boolean>;
  private _readySubject: ReplaySubject<boolean>;

  private _settingsSubscription?: Subscription;

  constructor(private _settingsService: SettingsService) {
    this._markersGroup = new L.FeatureGroup();
    this._clusterGroup = new L.MarkerClusterGroup();
    this._auxGroup = new L.FeatureGroup();

    this._readySubject = new ReplaySubject<boolean>(1);
    this.ready$ = this._readySubject.asObservable();

    this._settingsSubscription = this._settingsService.mapMode$.subscribe(
      (mode) => {
        this.switchMode(mode);
      }
    );
  }

  ngOnDestroy(): void {
    if (this._settingsSubscription) {
      this._settingsSubscription.unsubscribe();
    }
  }

  initMap(map: L.Map, mode: MapMode): void {
    this._map = map;
    this._mode = mode;

    switch (this._mode) {
      case MapMode.IndividualMarkers:
        this._map.addLayer(this._markersGroup);
        break;
      case MapMode.Clusters:
        this._map.addLayer(this._clusterGroup);
        break;
    }
    this._map.addLayer(this._auxGroup);

    this._readySubject.next(true);
  }

  addMarker(marker: L.Marker) {
    this._markersGroup.addLayer(marker);
    this._clusterGroup.addLayer(marker);
  }

  addAuxMarker(marker: L.Marker, zIndexOffset: number = 100000) {
    marker.setZIndexOffset(zIndexOffset); // make marker visible over other layers
    this._auxGroup.addLayer(marker);
  }

  removeMarker(marker: L.Marker) {
    if (this._markersGroup.hasLayer(marker))
      this._markersGroup.removeLayer(marker);
    if (this._clusterGroup.hasLayer(marker))
      this._clusterGroup.removeLayer(marker);
  }

  removeAuxMarker(marker: L.Marker) {
    if (this._auxGroup.hasLayer(marker)) this._auxGroup.removeLayer(marker);
  }

  clearMarkers() {
    this._markersGroup.clearLayers();
    this._clusterGroup.clearLayers();
  }

  clearAuxMarkers() {
    this._auxGroup.clearLayers();
  }

  switchMode(mode: MapMode) {
    if (this._mode === mode) return;
    this._mode = mode;

    if (!this._map) return;
    switch (this._mode) {
      case MapMode.IndividualMarkers:
        if (this._map.hasLayer(this._clusterGroup))
          this._map.removeLayer(this._clusterGroup);
        this._map.addLayer(this._markersGroup);
        break;
      case MapMode.Clusters:
        if (this._map.hasLayer(this._markersGroup))
          this._map.removeLayer(this._markersGroup);
        this._map.addLayer(this._clusterGroup);
        break;
    }
  }
}
