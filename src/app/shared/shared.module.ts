import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BouncingPinComponent } from './components/spinners/bouncing-pin/bouncing-pin.component';
import { LogoPinComponent } from './components/logo-pin/logo-pin.component';
import { HamburgerAnimatedComponent } from './components/hamburger-animated/hamburger-animated.component';
import { StringInputComponent } from './components/forms/string-input/string-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputErrorsComponent } from './components/forms/input-errors.component';
import { PasswordInputComponent } from './components/forms/password-input/password-input.component';
import { TextareaInputComponent } from './components/forms/textarea-input/textarea-input.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { RatingInputComponent } from './components/forms/rating-input/rating-input.component';
import { StarRatingIntegerComponent } from './components/star-rating-integer/star-rating-integer.component';
import { EmailInputComponent } from './components/forms/email-input/email-input.component';
import { NumberInputComponent } from './components/forms/number-input/number-input.component';

const declarations = [
  BouncingPinComponent,
  LogoPinComponent,
  HamburgerAnimatedComponent,
  // AbstractInputComponent,
  StringInputComponent,
  NumberInputComponent,
  EmailInputComponent,
  PasswordInputComponent,
  InputErrorsComponent,
  TextareaInputComponent,
  StarRatingComponent,
  RatingInputComponent,
  StarRatingIntegerComponent,
];
const imports = [FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [...declarations],
  imports: [CommonModule, ...imports],
  exports: [...imports, ...declarations],
})
export class SharedModule {}
