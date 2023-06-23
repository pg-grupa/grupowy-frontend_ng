import { MapMode, Theme } from 'src/app/core/enums/settings';
import { IEnvironment } from 'src/app/core/interfaces/environment';

export const defaultEnv: IEnvironment = {
  production: false,
  logging: [],
  apiUrl: 'http://localhost:80/api/v1/',
  initMapConfig: {
    lat: 54.341073109619394,
    lng: 18.629250526428226,
    zoom: 14,
  },
  defaultSettings: {
    mapMode: MapMode.Clusters,
    theme: Theme.Dark,
  },
};
