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
