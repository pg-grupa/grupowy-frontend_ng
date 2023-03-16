import { Component, Input } from '@angular/core';

@Component({
  selector: 'spinner-bouncing-pin',
  templateUrl: './bouncing-pin.component.html',
  styleUrls: ['./bouncing-pin.component.scss'],
})
export class BouncingPinComponent {
  @Input() color: string = 'var(--color-primary, #00008B)';
  @Input() size: string = '1rem';
}
