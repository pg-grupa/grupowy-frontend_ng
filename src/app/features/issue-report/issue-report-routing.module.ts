import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheInitializedResolver } from 'src/app/core/resolvers/cache-initialized.resolver';
import { LocationResolver } from 'src/app/core/resolvers/location.resolver';
import { IssueReportComponent } from './issue-report.component';
import { GeneralReportComponent } from './pages/general-report/general-report.component';
import { LocationReportComponent } from './pages/location-report/location-report.component';

import * as AuthGuard from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: IssueReportComponent,
    // canActivate: [AuthGuard.canActivate],
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full',
      },
      {
        path: 'general',
        component: GeneralReportComponent,
      },
      {
        path: 'location/:id',
        component: LocationReportComponent,
        resolve: {
          location: LocationResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueReportRoutingModule {}
