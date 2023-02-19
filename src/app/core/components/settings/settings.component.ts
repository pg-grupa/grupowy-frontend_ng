import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapMode, Theme } from '../../enums/settings';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'core-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly MapModeMapping = {
    Clusters: MapMode.Clusters,
    Individual: MapMode.IndividualMarkers,
  };
  readonly ThemeMapping = {
    Light: Theme.Light,
    Dark: Theme.Dark,
  };

  selectedMapMode?: MapMode;
  selectedTheme?: Theme;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _renderer: Renderer2,
    private _settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this._settingsService.mapMode$.subscribe((mode) => {
        this.setMapMode(mode);
      })
    );

    this._subscriptions.push(
      this._settingsService.theme$.subscribe((theme) => {
        this.setTheme(theme);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  setMapMode(mapMode: MapMode): void {
    if (mapMode === this.selectedMapMode) return;
    this.selectedMapMode = mapMode;
    this._settingsService.setMapMode(mapMode);
  }

  setTheme(theme: Theme): void {
    if (theme === this.selectedTheme) return;

    this.selectedTheme = theme;
    switch (theme) {
      case Theme.Light:
        this._renderer.removeClass(document.body, 'theme:dark');
        this._renderer.addClass(document.body, 'theme:light');
        break;
      case Theme.Dark:
        this._renderer.removeClass(document.body, 'theme:light');
        this._renderer.addClass(document.body, 'theme:dark');
        break;
    }

    this._settingsService.setTheme(theme);
  }
}
