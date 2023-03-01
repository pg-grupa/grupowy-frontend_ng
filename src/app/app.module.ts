import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { CoordinatesModalComponent } from './pages/map-page/coordinates-modal/coordinates-modal.component';
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { GeneralReportComponent } from './pages/report-page/general-report/general-report.component';
import { LocationReportComponent } from './pages/report-page/location-report/location-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutPageComponent } from './pages/about-page/about-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MapPageComponent,
    NavigationPageComponent,
    LocationModalComponent,
    FilterModalComponent,
    CoordinatesModalComponent,
    ReportPageComponent,
    GeneralReportComponent,
    LocationReportComponent,
    AboutPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
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
