import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheInitializedResolver } from './core/resolvers/cache-initialized.resolver';
import { AboutPageComponent } from './pages/about-page/about-page.component';

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
<<<<<<< HEAD
        path: 'about',
        component: AboutPageComponent,
        outlet: 'background',
=======
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
>>>>>>> main
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
  {
<<<<<<< HEAD
    path: 'issue',
    loadChildren: () =>
      import('./features/issue-report/issue-report.module').then(
        (m) => m.IssueReportModule
      ),
    outlet: 'report',
  },
  {
=======
>>>>>>> main
    path: 'error',
    loadChildren: () =>
      import('./features/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/error/error.module').then((m) => m.ErrorModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
