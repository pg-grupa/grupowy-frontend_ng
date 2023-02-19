import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'core-theme-picker',
  template: '',
})
export class ThemePickerComponent implements OnInit {
  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    this.renderer.addClass(document.body, 'theme:dark');
  }
}
