import { LatLng, LatLngBounds } from 'leaflet';
import { IMapState } from './map-state';

export enum MapEventType {
  MapInitialized,
  MoveEnd,
  ZoomEnd,
  ClickMap,
  ClickMarker,
}

export interface IMapEvent {
  type: MapEventType;
  payload?: any;
  state?: IMapState;
}

export abstract class MapStateChangeEvent implements IMapEvent {
  abstract type: MapEventType;
  state: IMapState;

  constructor(state: IMapState) {
    this.state = state;
  }
}

export class MapInitializedEvent extends MapStateChangeEvent {
  type = MapEventType.MapInitialized;
}

export class MoveEndEvent extends MapStateChangeEvent {
  type = MapEventType.MoveEnd;
}

export class ZoomEndEvent extends MapStateChangeEvent {
  type = MapEventType.ZoomEnd;
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
