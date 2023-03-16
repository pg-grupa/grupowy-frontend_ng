import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationReviewsResolver } from 'src/app/core/resolvers/location-reviews.resolver';
import { LocationTitleResolver } from 'src/app/core/resolvers/location-title.resolver';
import { LocationResolver } from 'src/app/core/resolvers/location.resolver';
import { MapComponent } from './map.component';
import { CoordinatesComponent } from './pages/coordinates/coordinates.component';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { LocationReviewsComponent } from './pages/location-details/location-reviews/location-reviews.component';
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
                path: 'services',
                component: LocationServicesComponent,
              },
              {
                path: 'reviews',
                component: LocationReviewsComponent,
                resolve: {
                  reviews: LocationReviewsResolver,
                },
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
