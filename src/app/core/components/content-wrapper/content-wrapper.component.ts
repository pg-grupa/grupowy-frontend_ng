import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'core-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss'],
})
export class ContentWrapperComponent {
  @Input('open') isOpen: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggle() {
    this.isOpen = !this.isOpen;
    this.openChange.emit(this.isOpen);
  }

  open() {
    this.isOpen = true;
    this.openChange.emit(true);
  }

  close() {
    this.isOpen = false;
    this.openChange.emit(false);
  }
}
