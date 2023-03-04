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
      {
        path: 'about',
        component: AboutPageComponent,
        outlet: 'background',
      },
    ],
  },
  {
    path: 'issue',
    loadChildren: () =>
      import('./features/issue-report/issue-report.module').then(
        (m) => m.IssueReportModule
      ),
    outlet: 'report',
  },
  {
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
