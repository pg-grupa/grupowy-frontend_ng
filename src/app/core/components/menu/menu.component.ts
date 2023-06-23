import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/user';

@Component({
  selector: 'core-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Output() mainNavigation = new EventEmitter<any>();

  settingsOpen: boolean = false;

  isAuthenticated$!: Observable<boolean>;
  user$!: Observable<IUser | null>;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this._authService.isAuthenticated$;
    this.user$ = this._authService.user$;
  }

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }

  onMainNavigation() {
    this.mainNavigation.emit(null);
  }
}
