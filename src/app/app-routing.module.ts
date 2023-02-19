import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheInitializedResolver } from './core/resolvers/cache-initialized.resolver';
import { MapInitializedResolver } from './core/resolvers/map-initialized.resolver';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'search',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'search',
  //   resolve: [CacheInitializedResolver, MapInitializedResolver],
  //   loadChildren: () =>
  //     import('./features/search/search.module').then((m) => m.SearchModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
