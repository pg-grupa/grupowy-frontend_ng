import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheInitializedResolver } from './core/resolvers/cache-initialized.resolver';

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
        path: 'filter',
        loadChildren: () =>
          import('./features/filter/filter.module').then((m) => m.FilterModule),
      },
      {
        path: 'navigate',
        loadChildren: () =>
          import('./features/navigation/navigation.module').then(
            (m) => m.NavigationModule
          ),
      },
    ],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./features/account/account.module').then((m) => m.AccountModule),
    outlet: 'auth',
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
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
