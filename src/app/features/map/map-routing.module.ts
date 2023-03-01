import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationResolver } from 'src/app/core/resolvers/location.resolver';
import { MapComponent } from './map.component';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    children: [
      {
        path: 'location/:id',
        component: LocationDetailsComponent,
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
export class MapRoutingModule {}
