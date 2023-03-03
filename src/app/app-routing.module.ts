import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheInitializedResolver } from './core/resolvers/cache-initialized.resolver';
import { LocationResolver } from './core/resolvers/location.resolver';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { GeneralReportComponent } from './pages/report-page/general-report/general-report.component';
import { LocationReportComponent } from './pages/report-page/location-report/location-report.component';
import { ReportPageComponent } from './pages/report-page/report-page.component';

const routes: Routes = [
  {
    path: '',
    resolve: [CacheInitializedResolver],
    children: [
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },

      {
        path: 'map',
        loadChildren: () =>
          import('./features/map/map.module').then((m) => m.MapModule),
      },
      {
        path: 'navigate',
        loadChildren: () =>
          import('./features/navigation/navigation.module').then(
            (m) => m.NavigationModule
          ),
      },
      // {
      //   path: 'map',
      //   component: MapPageComponent,
      //   children: [
      //     {
      //       path: 'location/:id',
      //       component: LocationModalComponent,
      //       resolve: {
      //         location: LocationResolver,
      //       },
      //     },
      //     {
      //       path: 'coordinates/:coords',
      //       component: CoordinatesModalComponent,
      //     },
      //     {
      //       path: 'filters',
      //       component: FilterModalComponent,
      //     },
      //   ],
      // },
      // {
      //   path: 'navigate',
      //   component: NavigationPageComponent,
      // },
      {
        path: 'issue',
        component: ReportPageComponent,
        outlet: 'foreground',
        children: [
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
      {
        path: 'about',
        component: AboutPageComponent,
        outlet: 'background',
      },
      {
        path: 'issue',
        component: ReportPageComponent,
        outlet: 'foreground',
        children: [
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
      {
        path: 'about',
        component: AboutPageComponent,
        outlet: 'background',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
