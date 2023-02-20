import { MapMode, Theme } from 'src/app/core/enums/settings';
import { IEnvironment } from 'src/app/core/interfaces/environment';

export const defaultEnv: IEnvironment = {
  production: false,
  logging: [],
  apiUrl: 'http://localhost:8000/api/',
  initMapConfig: {
    lat: 54.352024,
    lng: 18.646639,
    zoom: 12,
  },
  defaultSettings: {
    mapMode: MapMode.Clusters,
    theme: Theme.Dark,
  },
};
