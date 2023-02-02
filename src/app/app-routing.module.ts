import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationTypeResolver } from './core/resolvers/location-type.resolver';
import { OverviewComponent } from './pages/overview/overview.component';
const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent,
    resolve: {
      locationTypes: LocationTypeResolver,
    },
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
