import { LatLng, LatLngBounds } from 'leaflet';

export enum MapEventType {
  MoveEnd,
  ZoomEnd,
  ClickMap,
  ClickMarker,
}

export interface IMapEvent {
  type: MapEventType;
  payload?: any;
}

export class MoveEndEvent implements IMapEvent {
  type = MapEventType.MoveEnd;
  payload: LatLngBounds;

  constructor(bounds: LatLngBounds) {
    this.payload = bounds;
  }
}

export class ZoomEndEvent implements IMapEvent {
  type = MapEventType.ZoomEnd;
  payload: number;

  constructor(zoom: number) {
    this.payload = zoom;
  }
}

export class ClickMapEvent implements IMapEvent {
  type = MapEventType.ClickMap;
  payload: LatLng;

  constructor(coordinates: LatLng) {
    this.payload = coordinates;
  }
}

export class ClickMarkerEvent implements IMapEvent {
  type = MapEventType.ClickMarker;
  payload: number;

  constructor(placeId: number) {
    this.payload = placeId;
  }
}
