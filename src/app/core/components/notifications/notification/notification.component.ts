import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { INotification } from 'src/app/core/interfaces/notification';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';

@Component({
  selector: 'core-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [fadeInOutTrigger({ duration: '200ms' })],
  host: { '[@fadeInOut]': '' },
})
export class NotificationComponent implements OnInit {
  @Input() notification!: INotification;
  @Output() close = new EventEmitter<INotification>();
  openDetails: boolean = false;

  @HostBinding('class') notificationClass = '';
  iconClass = '';

  ngOnInit(): void {
    switch (this.notification.type) {
      case 'info':
        this.notificationClass = 'info';
        this.iconClass = 'fa-circle-info';
        break;

      case 'success':
        this.notificationClass = 'success';
        this.iconClass = 'fa-circle-check';
        break;

      case 'warning':
        this.notificationClass = 'warning';
        this.iconClass = 'fa-circle-exclamation';
        break;

      default:
        this.notificationClass = 'error';
        this.iconClass = 'fa-triangle-exclamation';
        break;
    }
  }

  onClose(): void {
    this.close.emit(this.notification);
  }

  toggleDetails(): void {
    this.openDetails = !this.openDetails;
  }
}
