import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BouncingPinComponent } from './components/spinners/bouncing-pin/bouncing-pin.component';



@NgModule({
  declarations: [
    BouncingPinComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BouncingPinComponent
  ]
})
export class SharedModule { }
