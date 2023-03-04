import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error0Component } from './pages/error0/error0.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ErrorComponent, Error404Component, Error0Component],
  imports: [CommonModule, ErrorRoutingModule, SharedModule],
})
export class ErrorModule {}
