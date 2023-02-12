import { Component } from '@angular/core';

@Component({
  selector: 'search-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent {
  onFocus() {
    console.warn('focus');
  }
}
