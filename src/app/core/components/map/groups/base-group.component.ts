import * as L from 'leaflet';
import { LayerGroupService } from 'src/app/core/services/layer-group.service';

export abstract class BaseGroupComponent {
  protected _layerGroup?: L.LayerGroup;

  constructor(
    protected _layerService: LayerGroupService,
    protected _parentLayerService: LayerGroupService
  ) {}

  addSelf() {
    if (this._layerGroup) this._parentLayerService.addLayer(this._layerGroup);
  }

  removeSelf() {
    if (this._layerGroup)
      this._parentLayerService.removeLayer(this._layerGroup);
  }

  show = () => this.addSelf();
  hide = () => this.removeSelf();
}
