import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationResolver } from 'src/app/core/resolvers/location.resolver';
import { MapComponent } from './map.component';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { LocationEventsComponent } from './pages/location-details/location-events/location-events.component';
import { LocationServicesComponent } from './pages/location-details/location-services/location-services.component';

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
        children: [
          {
            path: 'events',
            component: LocationEventsComponent,
          },
          {
            path: 'services',
            component: LocationServicesComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
