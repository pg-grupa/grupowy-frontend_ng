import { LoggerType, LogLevel } from 'src/app/core/services/logger.service';

export const environment = {
  production: false,
  logging: [
    {
      type: LoggerType.CONSOLE,
      level: LogLevel.DEBUG,
    },
    {
      type: LoggerType.SESSION_STORAGE,
      level: LogLevel.DEBUG,
      storageKey: 'SessionLogger',
    },
  ],
  apiUrl: 'http://localhost:8000/api/',
  initMapConfig: {
    center: [54.352024, 18.646639] as [number, number],
    zoom: 12,
    zoomControl: false,
  },
};
