import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BouncingPinComponent } from './components/spinners/bouncing-pin/bouncing-pin.component';
import { LogoPinComponent } from './components/logo-pin/logo-pin.component';
import { HamburgerAnimatedComponent } from './components/hamburger-animated/hamburger-animated.component';

@NgModule({
  declarations: [
    BouncingPinComponent,
    LogoPinComponent,
    HamburgerAnimatedComponent,
  ],
  imports: [CommonModule],
  exports: [BouncingPinComponent, LogoPinComponent, HamburgerAnimatedComponent],
})
export class SharedModule {}
