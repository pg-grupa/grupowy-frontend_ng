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
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { GeneralReportComponent } from './pages/report-page/general-report/general-report.component';
import { LocationReportComponent } from './pages/report-page/location-report/location-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { TitleStrategy } from '@angular/router';
import { ServoMapTitleStrategy } from './core/utils/title-strategy';

@NgModule({
  declarations: [
    AppComponent,
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
    {
      provide: TitleStrategy,
      useClass: ServoMapTitleStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
