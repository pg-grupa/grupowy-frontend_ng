import { Component, Input, OnInit, Self, SkipSelf } from '@angular/core';
import { LayerGroupService } from 'src/app/core/services/layer-group.service';

import * as L from 'leaflet';
import { take } from 'rxjs';
import { BaseGroupComponent } from './base-group.component';

@Component({
  selector: 'core-feature-group',
  template: '',
  providers: [LayerGroupService],
})
export class FeatureGroupComponent
  extends BaseGroupComponent
  implements OnInit
{
  @Input() options?: L.LayerOptions;

  constructor(
    @Self() _layerService: LayerGroupService,
    @SkipSelf() _parentLayerService: LayerGroupService
  ) {
    super(_layerService, _parentLayerService);
  }

  ngOnInit(): void {
    this._layerGroup = new L.FeatureGroup(undefined, this.options);
    this._layerService.initLayer(this._layerGroup);

    this._parentLayerService.ready$.pipe(take(1)).subscribe(() => {
      this._parentLayerService.addLayer(this._layerGroup!);
    });
  }
}
