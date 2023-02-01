import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export enum LogLevel {
  NONE,
  ERROR,
  WARNING,
  INFO,
  DEBUG,
}

export enum LoggerType {
  CONSOLE,
  SESSION_STORAGE,
  LOCAL_STORAGE,
}

export interface ILoggerConfig {
  type: LoggerType;
  level: LogLevel;
  storageKey?: string;
}

interface ILogEntry {
  label: string;
  timeStamp: Date;
  level: LogLevel;
  message: string;
  optionalParams: any[];
}

interface IStorageLogs {
  [label: string]: ILogEntry[];
}

const DEFAULT_CONFIG: ILoggerConfig[] = [
  {
    type: LoggerType.CONSOLE,
    level: LogLevel.ERROR,
  },
];

export abstract class BaseLogger {
  protected _level: LogLevel = LogLevel.ERROR;

  constructor(level: LogLevel) {
    this._level = level;
  }

  protected abstract _log(logEntry: ILogEntry): void;

  protected _shouldLog(logLevel: LogLevel): boolean {
    if (this._level === LogLevel.NONE) {
      return false;
    }
    return logLevel <= this._level;
  }

  public log(logEntry: ILogEntry): void {
    if (this._shouldLog(logEntry.level)) this._log(logEntry);
  }
}

export class ConsoleLogger extends BaseLogger {
  protected _log(logEntry: ILogEntry): void {
    this._printEntry(logEntry);
  }

  protected _printEntry(logEntry: ILogEntry): void {
    let callFunc: Function;
    switch (logEntry.level) {
      case LogLevel.ERROR:
        callFunc = console.error;
        break;
      case LogLevel.WARNING:
        callFunc = console.warn;
        break;
      case LogLevel.INFO:
        callFunc = console.info;
        break;
      default:
        callFunc = console.debug;
        break;
    }
    callFunc(this._formatMessage(logEntry), ...logEntry.optionalParams);
  }
  protected _formatMessage(logEntry: ILogEntry): string {
    return `[${
      LogLevel[logEntry.level]
    }][${logEntry.timeStamp.toLocaleTimeString()}][${logEntry.label}] ${
      logEntry.message
    }\n`;
  }
}

abstract class StorageLogger extends BaseLogger {
  protected _storage!: Storage;
  private _storageKey: string;

  constructor(level: LogLevel, storageKey: string) {
    super(level);
    this._storageKey = storageKey;
  }

  protected _log(logEntry: ILogEntry): void {
    let logs = this._retrieveAll();
    if (logEntry.label in logs === false) logs[logEntry.label] = [];
    try {
      // Check if optionalParams can be stringified.
      // Note: JSON.stringify can't handle objects with circular references,
      // ie. objects having DOM ref like 'events'
      JSON.stringify(logEntry.optionalParams);
    } catch (e) {
      logEntry.optionalParams = ['Error stringifying optionalParams.'];
    }
    logs[logEntry.label].push(logEntry);
    this._storage.setItem(this._storageKey, JSON.stringify(logs));
  }

  protected _retrieve(label: string): ILogEntry[] {
    let logs = this._retrieveAll();
    if (label in logs) return logs[label];
    else return [];
  }

  protected _retrieveAll(): IStorageLogs {
    return JSON.parse(this._storage.getItem(this._storageKey) || '{}');
  }
}

export class SessionStorageLogger extends StorageLogger {
  constructor(level: LogLevel, storageKey: string = 'SessionLogs') {
    super(level, storageKey);
    this._storage = sessionStorage;
  }
}

export class LocalStorageLogger extends StorageLogger {
  constructor(level: LogLevel, storageKey: string = 'LocalLogs') {
    super(level, storageKey);
    this._storage = localStorage;
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private _loggers: BaseLogger[] = [];

  constructor() {
    // load loggers configuration
    let config;
    if ('logging' in environment) {
      config = environment.logging as ILoggerConfig[];
    } else {
      config = DEFAULT_CONFIG;
    }

    // create loggers
    config.forEach((loggerConfig) => {
      let logger: BaseLogger;
      switch (loggerConfig.type) {
        case LoggerType.CONSOLE:
          logger = new ConsoleLogger(loggerConfig.level);
          break;
        case LoggerType.SESSION_STORAGE:
          logger = new SessionStorageLogger(
            loggerConfig.level,
            loggerConfig.storageKey!
          );
          break;
        case LoggerType.LOCAL_STORAGE:
          logger = new LocalStorageLogger(
            loggerConfig.level,
            loggerConfig.storageKey!
          );
          break;
      }
      this._loggers.push(logger);
    });
  }

  private _log(logEntry: ILogEntry): void {
    this._loggers.forEach((logger) => {
      logger.log(logEntry);
    });
  }

  public error(label: string, message?: any, ...optionalParams: any[]): void {
    this._log({
      label,
      timeStamp: new Date(),
      level: LogLevel.ERROR,
      message,
      optionalParams,
    });
  }

  public warn(label: string, message?: any, ...optionalParams: any[]): void {
    this._log({
      label,
      timeStamp: new Date(),
      level: LogLevel.WARNING,
      message,
      optionalParams,
    });
  }

  public info(label: string, message?: any, ...optionalParams: any[]): void {
    this._log({
      label,
      timeStamp: new Date(),
      level: LogLevel.INFO,
      message,
      optionalParams,
    });
  }

  public debug(label: string, message?: any, ...optionalParams: any[]): void {
    this._log({
      label,
      timeStamp: new Date(),
      level: LogLevel.DEBUG,
      message,
      optionalParams,
    });
  }
}
