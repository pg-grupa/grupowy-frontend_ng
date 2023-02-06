import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheInitializedResolver } from './core/resolvers/cache-initialized.resolver';
import { MapInitializedResolver } from './core/resolvers/map-initialized.resolver';
import { OverviewComponent } from './pages/overview/overview.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    component: OverviewComponent,
    resolve: [CacheInitializedResolver, MapInitializedResolver],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
