import { Component, Input } from '@angular/core';
import { ILocation, ILocationFull } from 'src/app/core/models/location';
import { CacheService } from '../../../services/cache.service';
import { MapMarkerComponent } from '../markers/map-marker.component';
import { ILocationType } from '../../../models/location-type';
import { LayerGroupService } from 'src/app/core/services/layer-group.service';

@Component({
  selector: 'core-location-marker[location]',
  template: '',
})
export class LocationMarkerComponent extends MapMarkerComponent {
  @Input() location!: ILocation | ILocationFull;

  constructor(
    private _cacheService: CacheService,
    _layerGroup: LayerGroupService
  ) {
    super(_layerGroup);
  }

  override ngOnInit(): void {
    if (!this.coordinates)
      this.coordinates = [this.location.latitude, this.location.longitude];

    if (!this.icon) {
      let locationType: ILocationType;

      if (typeof this.location.place_type_id === 'number') {
        locationType = this._cacheService.getLocationType(
          this.location.place_type_id as number
        )!;
      } else {
        locationType = this.location.place_type_id as ILocationType;
      }
      this.icon = locationType.icon;
    }

    if (!this.tooltip) {
      this.tooltip = this.location.name;
    }

    super.ngOnInit();
  }
}
