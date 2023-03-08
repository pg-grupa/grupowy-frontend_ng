import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ServoMapApp';

  sidebarOpen = false;

  closeSidebar() {
    this.sidebarOpen = false;
  }

  openSidebar() {
    this.sidebarOpen = true;
  }
}
