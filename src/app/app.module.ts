import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { APIInterceptor } from './core/interceptors/api.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { OverviewComponent } from './pages/overview/overview.component';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';

@NgModule({
  declarations: [AppComponent, OverviewComponent, LocationDetailsComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule],
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
