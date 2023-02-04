import { LoggerType, LogLevel } from 'src/app/core/enums/logs';
import { IEnvironment } from 'src/app/core/interfaces/environment';
import { defaultEnv } from './environment.default';

export const environment: IEnvironment = {
  ...defaultEnv,
  production: true,
  logging: [
    {
      type: LoggerType.CONSOLE,
      level: LogLevel.WARNING,
    },
  ],
};
