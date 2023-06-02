import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationReviewsResolver } from 'src/app/core/resolvers/location-reviews.resolver';
import { LocationTitleResolver } from 'src/app/core/resolvers/location-title.resolver';
import { LocationResolver } from 'src/app/core/resolvers/location.resolver';
import { MapComponent } from './map.component';
import { CoordinatesComponent } from './pages/coordinates/coordinates.component';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { LocationReviewEditComponent } from './pages/location-details/location-reviews/location-review-edit/location-review-edit.component';
import { LocationReviewsListComponent } from './pages/location-details/location-reviews/location-reviews-list/location-reviews-list.component';
import { LocationReviewsComponent } from './pages/location-details/location-reviews/location-reviews.component';
import { LocationServicesComponent } from './pages/location-details/location-services/location-services.component';
import * as AuthGuard from 'src/app/core/guards/auth.guard';
import { LocationReviewAddComponent } from './pages/location-details/location-reviews/location-review-add/location-review-add.component';
import { LocationMyReviewResolver } from 'src/app/core/resolvers/location-my-review.resolver';
import { LocationServicesResolver } from 'src/app/core/resolvers/location-services.resolver';
import { LocationOpenhoursComponent } from './pages/location-details/location-openhours/location-openhours.component';

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
                path: 'open-hours',
                component: LocationOpenhoursComponent,
              },
              {
                path: 'services',
                component: LocationServicesComponent,
                resolve: {
                  locationServices: LocationServicesResolver,
                },
              },
              {
                path: 'reviews',
                component: LocationReviewsComponent,
                children: [
                  {
                    path: '',
                    redirectTo: 'list',
                    pathMatch: 'full',
                  },
                  {
                    path: 'list',
                    component: LocationReviewsListComponent,
                    // Moved myReview loading to component
                    // resolve: {
                    //   reviews: LocationReviewsResolver,
                    //   myReview: LocationMyReviewResolver,
                    // },
                  },
                  {
                    path: 'add',
                    component: LocationReviewAddComponent,
                    canActivate: [AuthGuard.canActivate],
                  },
                  {
                    path: 'edit',
                    component: LocationReviewEditComponent,
                    canActivate: [AuthGuard.canActivate],
                    resolve: {
                      myReview: LocationMyReviewResolver,
                    },
                  },
                ],
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
