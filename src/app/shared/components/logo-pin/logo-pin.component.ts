import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-logo-pin',
  templateUrl: './logo-pin.component.html',
  styleUrls: ['./logo-pin.component.scss'],
})
export class LogoPinComponent {
  @Input() color: string = '#00008B';
  @Input() size: string = '3rem';
}
