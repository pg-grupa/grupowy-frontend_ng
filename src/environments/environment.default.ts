import { MapMode, Theme } from 'src/app/core/enums/settings';
import { IEnvironment } from 'src/app/core/interfaces/environment';

export const defaultEnv: IEnvironment = {
  production: false,
  logging: [],
  apiUrl: 'http://localhost:80/api/v1/',
  initMapConfig: {
    lat: 54.26993584511107,
    lng: 18.26837539672852,
    zoom: 12,
  },
  defaultSettings: {
    mapMode: MapMode.Clusters,
    theme: Theme.Dark,
  },
};
