import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { INotification } from '../../interfaces/notification';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'core-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public notifications: INotification[] = [];

  private _subscription!: Subscription;

  constructor(private _notificationsService: NotificationsService) {}

  ngOnInit() {
    this._subscription = this._notificationsService.notifications$.subscribe(
      (notification) => this.addNotification(notification)
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  addNotification(notification: INotification) {
    this.notifications.push(notification);
    if (notification.timeout) {
      setTimeout(
        () => this.removeNotification(notification),
        notification.timeout
      );
    }
  }

  removeNotification(notification: INotification) {
    this.notifications = this.notifications.filter(
      (n) => n.id !== notification.id
    );
  }
}
