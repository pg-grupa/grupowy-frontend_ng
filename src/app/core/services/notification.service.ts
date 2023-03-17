import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { NotificationType, INotification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notificationSubject = new ReplaySubject<INotification>(1);
  public readonly notifications$: Observable<INotification> =
    this._notificationSubject.asObservable();

  private _id = 0;

  constructor() {}

  addNotification(
    type: NotificationType,
    message: string,
    details?: string,
    timeout?: number
  ) {
    const notification: INotification = {
      id: this._id++,
      type: type,
      message: message,
      details: details,
      timeout: timeout,
    };
    this._notificationSubject.next(notification);
  }

  info(message: string, timeout: number = 10000, details?: string) {
    this.addNotification('info', message, details, timeout);
  }

  success(message: string, timeout: number = 3000, details?: string) {
    this.addNotification('success', message, details, timeout);
  }

  warning(message: string, timeout: number = 5000, details?: string) {
    this.addNotification('warning', message, details, timeout);
  }

  error(message: string, timeout: number = 0, details?: string) {
    this.addNotification('error', message, details, timeout);
  }
}
