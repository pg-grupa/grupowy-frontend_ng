import { AfterViewInit, Component } from '@angular/core';
import { LoggerService } from '../../services/logger.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'core-map',
  template: '<div id="map"></div>',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  constructor(
    private _mapService: MapService,
    private _logger: LoggerService
  ) {}

  ngAfterViewInit(): void {
    this._logger.debug('MapComponent', 'AfterViewInit');
    this._mapService.initializeService();
  }
}
