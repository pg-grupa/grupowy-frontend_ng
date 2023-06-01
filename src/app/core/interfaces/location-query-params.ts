import * as L from 'leaflet';

export interface IRadiusQueryParams {
  longitude: number;
  latitude: number;
  radius: number;
  type?: number[];
}

// export interface IBoundsQueryParams {
//   longitude__gte: number;
//   longitude__lt: number;
//   latitude__gte: number;
//   latitude__lt: number;
//   type?: number[];
// }

export interface IBoundsQueryParams {
  lng1: number;
  lng2: number;
  lat1: number;
  lat2: number;
  type?: number[];
}

export function parseBoundsToQuery(bounds: L.LatLngBounds): IBoundsQueryParams {
  return {
    lng1: bounds.getWest(),
    lng2: bounds.getEast(),
    lat1: bounds.getSouth(),
    lat2: bounds.getNorth(),
  };
}
