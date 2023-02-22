import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { APIInterceptor } from './core/interceptors/api.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { SharedModule } from './shared/shared.module';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { NavigationPageComponent } from './pages/navigation-page/navigation-page.component';
import { LocationModalComponent } from './pages/map-page/location-modal/location-modal.component';
import { FilterModalComponent } from './pages/map-page/filter-modal/filter-modal.component';

@NgModule({
  declarations: [AppComponent, MapPageComponent, NavigationPageComponent, LocationModalComponent, FilterModalComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, SharedModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
