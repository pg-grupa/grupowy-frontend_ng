import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'core-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Output() mainNavigation = new EventEmitter<any>();

  settingsOpen: boolean = false;

  isAuthenticated$!: Observable<boolean>;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this._authService.isAuthenticated$;
  }

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }

  onMainNavigation() {
    this.mainNavigation.emit(null);
  }
}
