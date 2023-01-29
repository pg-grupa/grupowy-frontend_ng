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
}

const defaultLogging = [
  {
    type: LoggerType.CONSOLE,
    level: LogLevel.ERROR,
  },
];

interface LogEntry {
  label: string;
  timeStamp: Date;
  level: LogLevel;
  message: string;
  optionalParams: any[];
}

abstract class Logger {
  private _level: LogLevel = LogLevel.ERROR;

  constructor(level: LogLevel) {
    this._level = level;
  }

  protected abstract _print(logEntry: LogEntry): void;

  protected _shouldLog(logLevel: LogLevel): boolean {
    if (this._level === LogLevel.NONE) {
      return false;
    }
    return logLevel <= this._level;
  }

  public log(logEntry: LogEntry): void {
    if (this._shouldLog(logEntry.level)) this._print(logEntry);
  }
}

class ConsoleLogger extends Logger {
  private _formatMessage(logEntry: LogEntry): string {
    return `[${logEntry.timeStamp.toLocaleTimeString()}][${
      LogLevel[logEntry.level]
    }][${logEntry.label}]\n ${logEntry.message}`;
  }
  protected _print(logEntry: LogEntry): void {
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
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private _loggers: Logger[] = [];

  constructor() {
    let config;
    if ('logging' in environment) {
      config = environment.logging;
    } else {
      config = defaultLogging;
    }
    config.forEach((loggerConfig) => {
      switch (loggerConfig.type) {
        case LoggerType.CONSOLE:
          this._loggers.push(new ConsoleLogger(loggerConfig.level));
          break;
        // case LoggerType.SESSION_STORAGE: // TODO
      }
    });
  }

  private _log(logEntry: LogEntry): void {
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
