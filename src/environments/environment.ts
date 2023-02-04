import { LoggerType, LogLevel } from 'src/app/core/enums/logs';
import { IEnvironment } from 'src/app/core/interfaces/environment';
import { defaultEnv } from './environment.default';

export const environment: IEnvironment = {
  ...defaultEnv,
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
};
