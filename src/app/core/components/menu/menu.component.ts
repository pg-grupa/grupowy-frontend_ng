import { Component, Input } from '@angular/core';

@Component({
  selector: 'core-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input('open') isOpen: boolean = false;

  settingsOpen: boolean = false;

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
