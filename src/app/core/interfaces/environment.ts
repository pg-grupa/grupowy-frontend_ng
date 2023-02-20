import { MapMode, Theme } from '../enums/settings';
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
  defaultSettings: {
    mapMode: MapMode;
    theme: Theme;
  };
}
