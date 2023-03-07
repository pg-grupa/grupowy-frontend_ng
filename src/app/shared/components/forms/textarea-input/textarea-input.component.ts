import { Component, Input } from '@angular/core';
import { AbstractInputComponent } from '../abstract-input.component';

@Component({
  selector: 'textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss'],
})
export class TextareaInputComponent extends AbstractInputComponent {
  @Input() maxLength: string | number | null = null;
  @Input() resize: 'none' | 'both' | 'horizontal' | 'vertical' = 'vertical';
}
