import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'core-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input('open') isOpen: boolean = false;

  settingsOpen: boolean = false;

  isAuthenticated$!: Observable<boolean>;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this._authService.isAuthenticated$;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }
}
