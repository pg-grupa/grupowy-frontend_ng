import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationTitleResolver } from 'src/app/core/resolvers/location-title.resolver';
import { LocationResolver } from 'src/app/core/resolvers/location.resolver';
import { MapComponent } from './map.component';
import { CoordinatesComponent } from './pages/coordinates/coordinates.component';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { LocationEventsComponent } from './pages/location-details/location-events/location-events.component';
import { LocationServicesComponent } from './pages/location-details/location-services/location-services.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    title: 'Map',
    children: [
      {
        path: 'location/:id',
        resolve: {
          location: LocationResolver,
        },
        children: [
          {
            // Made it a subroute, so LocationTitleResolver has access to route.parent.data
            // Other possible solutions: make Subject emiting  location object/location name
            // and return it in resolver.
            path: '',
            component: LocationDetailsComponent,
            title: LocationTitleResolver,
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
      {
        path: 'coordinates/:coords',
        component: CoordinatesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
