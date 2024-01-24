import { Component } from '@angular/core';
import { AbstractInputComponent } from '../abstract-input.component';

@Component({
  selector: 'number-input',
  templateUrl: './number-input.component.html',
  styles: [],
})
export class NumberInputComponent extends AbstractInputComponent<number> {}
