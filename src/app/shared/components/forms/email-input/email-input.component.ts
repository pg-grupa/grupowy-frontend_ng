import { Component } from '@angular/core';
import { AbstractInputComponent } from '../abstract-input.component';

@Component({
  selector: 'email-input',
  templateUrl: './email-input.component.html',
  styles: [],
})
export class EmailInputComponent extends AbstractInputComponent<string> {}
