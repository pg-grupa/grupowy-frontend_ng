import { LatLng, LatLngBounds } from 'leaflet';

export interface IMapState {
  zoom: number;
  center: LatLng;
  bounds?: LatLngBounds;
}
