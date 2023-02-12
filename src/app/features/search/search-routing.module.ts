import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { LocationResolver } from './resolvers/location.resolver';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    children: [
      {
        path: 'details/:id',
        component: LocationDetailsComponent,
        resolve: { location: LocationResolver },
        runGuardsAndResolvers: 'pathParamsChange',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
