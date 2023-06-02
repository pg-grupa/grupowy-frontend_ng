import { Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'input-errors[control]',
  template: `
    <ul *ngIf="control && showError" class="errors-list">
      <li *ngIf="control.errors?.['required']">This field is required</li>
      <li *ngIf="control.errors?.['maxlength']">
        Input too long. Max length:
        {{ control.errors?.['maxlength'].requiredLength }}
      </li>
      <li *ngIf="control.errors?.['minlength']">
        Input too short. Min length:
        {{ control.errors?.['minlength'].requiredLength }}
      </li>
      <li *ngIf="control.errors?.['email']">Enter valid email address.</li>
      <li *ngIf="control.errors?.['serverErrors']">
        {{ control.errors?.['serverErrors']}}
      </li>
    </ul>
  `,
  styles: [],
})
export class InputErrorsComponent {
  @Input() control?: NgControl;

  public get showError(): boolean {
    if (!this.control || !this.control.invalid) return false;

    const { dirty, touched } = this.control;

    return dirty || touched || false;
  }
}
