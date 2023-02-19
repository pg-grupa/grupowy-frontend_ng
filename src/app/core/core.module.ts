import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MapMarkerComponent } from './components/map/map-marker.component';
import { LocationMarkerComponent } from './components/map/location-marker.component';
import { MenuComponent } from './components/menu/menu.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';

@NgModule({
  declarations: [
    MapComponent,
    LoadingComponent,
    MapMarkerComponent,
    LocationMarkerComponent,
    MenuComponent,
    ThemePickerComponent,
  ],
  imports: [CommonModule, SharedModule, HttpClientModule],
  exports: [
    MapComponent,
    LoadingComponent,
    MapMarkerComponent,
    LocationMarkerComponent,
    MenuComponent,
    ThemePickerComponent,
  ],
})
export class CoreModule {}
