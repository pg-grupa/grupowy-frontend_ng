import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notifications: NotificationsService
  ) {}

  ngOnInit() {
    this._authService.getLogout(false).subscribe(() => {
      this._notifications.success('You have been logged out.');
      this._router.navigateByUrl('/');
    });
  }
}
