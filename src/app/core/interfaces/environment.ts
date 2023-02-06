import { ILoggerConfig } from '../services/logger.service';

export interface IEnvironment {
  production: boolean;
  logging: ILoggerConfig[];
  apiUrl: string;
  initMapConfig: {
    lat: number;
    lng: number;
    zoom: number;
  };
  markersConfig: {
    minZoom: number;
    maxZoom: number;
    mode: 'none' | 'marker' | 'cluster';
  }[];
}
