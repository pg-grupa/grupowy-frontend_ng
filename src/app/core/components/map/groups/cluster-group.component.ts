import { Component, Input, OnInit, Self, SkipSelf } from '@angular/core';
import { LayerGroupService } from 'src/app/core/services/layer-group.service';

import * as L from 'leaflet';
import 'leaflet-extra-markers';
import 'leaflet.markercluster';
import { take } from 'rxjs';
import { BaseGroupComponent } from './base-group.component';

@Component({
  selector: 'core-cluster-group',
  template: '',
  providers: [LayerGroupService],
})
export class ClusterGroupComponent
  extends BaseGroupComponent
  implements OnInit
{
  DEFAULT_OPTIONS: L.MarkerClusterGroupOptions = {
    disableClusteringAtZoom: 16,
    maxClusterRadius: (zoom) => (18 - zoom) * 5 + 60,
  };
  @Input() options?: L.MarkerClusterGroupOptions;

  constructor(
    @Self() _layerService: LayerGroupService,
    @SkipSelf() _parentLayerService: LayerGroupService
  ) {
    super(_layerService, _parentLayerService);
  }

  ngOnInit(): void {
    this._layerGroup = new L.MarkerClusterGroup({
      ...this.DEFAULT_OPTIONS,
      ...this.options,
    });
    this._layerService.initLayer(this._layerGroup!);

    this._parentLayerService.ready$.pipe(take(1)).subscribe(() => {
      this._parentLayerService.addLayer(this._layerGroup!);
    });
  }
}
