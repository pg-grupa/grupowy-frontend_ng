import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MapMode, Theme } from '../enums/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _mapModeSubject = new ReplaySubject<MapMode>(1);
  mapMode$ = this._mapModeSubject.asObservable();

  private _themeSubject = new ReplaySubject<Theme>(1);
  theme$ = this._themeSubject.asObservable();

  private _settings: {
    mapMode: MapMode;
    theme: Theme;
  };

  constructor() {
    const settings = JSON.parse(localStorage.getItem('settings') || 'null');
    if (settings) {
      this._settings = settings;
    } else {
      this._settings = environment.defaultSettings;
    }

    this._updateSettings();
  }

  private _updateSettings() {
    localStorage.setItem('settings', JSON.stringify(this._settings));
    this._mapModeSubject.next(this._settings.mapMode);
    this._themeSubject.next(this._settings.theme);
  }

  setMapMode(mode: MapMode) {
    if (this._settings.mapMode === mode) return;

    this._settings.mapMode = mode;
    this._updateSettings();
  }

  setTheme(theme: Theme) {
    if (this._settings.theme === theme) return;

    this._settings.theme = theme;
    this._updateSettings();
  }
}
