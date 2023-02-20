import { Component, Input } from '@angular/core';
import { ILocation, ILocationFull } from 'src/app/core/models/location';
import { CacheService } from '../../services/cache.service';
import { MapMarkerComponent } from './map-marker.component';
import { MapService } from 'src/app/core/components/map/map.service';
import { ILocationType } from '../../models/location-type';

@Component({
  selector: 'location-marker[location]',
  template: '',
})
export class LocationMarkerComponent extends MapMarkerComponent {
  @Input() location!: ILocation | ILocationFull;

  constructor(private _cacheService: CacheService, _mapService: MapService) {
    super(_mapService);
  }

  override ngAfterViewInit(): void {
    if (!this.coordinates)
      this.coordinates = [this.location.latitude, this.location.longitude];

    if (!this.icon) {
      let locationType: ILocationType;

      if (typeof this.location.type === 'number') {
        locationType = this._cacheService.getLocationType(
          this.location.type as number
        )!;
      } else {
        locationType = this.location.type as ILocationType;
      }
      this.icon = locationType.icon;
    }

    if (!this.tooltip) {
      this.tooltip = this.location.name;
    }

    super.ngAfterViewInit();
  }
}
