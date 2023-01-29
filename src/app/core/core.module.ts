import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MapComponent, LoadingComponent],
  imports: [CommonModule, SharedModule, HttpClientModule],
  exports: [MapComponent, LoadingComponent],
})
export class CoreModule {}
