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
  markersConfig: [
    {
      minZoom: 0,
      maxZoom: 9,
      mode: 'none',
    },
    {
      minZoom: 10,
      maxZoom: 13,
      mode: 'cluster',
    },
    {
      minZoom: 14,
      maxZoom: 18,
      mode: 'marker',
    },
  ],
};
