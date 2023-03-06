import { Component } from '@angular/core';
import { AbstractInputComponent } from '../abstract-input.component';

@Component({
  selector: 'string-input',
  templateUrl: './string-input.component.html',
  styles: [],
})
export class StringInputComponent extends AbstractInputComponent<string> {}
