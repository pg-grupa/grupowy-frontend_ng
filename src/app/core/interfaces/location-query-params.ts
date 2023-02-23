import * as L from 'leaflet';

export interface IRadiusQueryParams {
  longitude: number;
  latitude: number;
  radius: number;
  type?: number[];
}

export interface IBoundsQueryParams {
  longitude__gte: number;
  longitude__lt: number;
  latitude__gte: number;
  latitude__lt: number;
  type?: number[];
}

export function parseBoundsToQuery(bounds: L.LatLngBounds): IBoundsQueryParams {
  return {
    longitude__gte: bounds.getWest(),
    longitude__lt: bounds.getEast(),
    latitude__gte: bounds.getSouth(),
    latitude__lt: bounds.getNorth(),
  };
}
