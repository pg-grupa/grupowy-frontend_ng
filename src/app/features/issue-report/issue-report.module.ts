import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueReportRoutingModule } from './issue-report-routing.module';
import { IssueReportComponent } from './issue-report.component';
import { GeneralReportComponent } from './pages/general-report/general-report.component';
import { LocationReportComponent } from './pages/location-report/location-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    IssueReportComponent,
    GeneralReportComponent,
    LocationReportComponent,
  ],
  imports: [
    CommonModule,
    IssueReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
})
export class IssueReportModule {}
