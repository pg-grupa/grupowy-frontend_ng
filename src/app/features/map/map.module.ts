import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { LocationServicesComponent } from './pages/location-details/location-services/location-services.component';
import { CoordinatesComponent } from './pages/coordinates/coordinates.component';
import { LocationReviewsComponent } from './pages/location-details/location-reviews/location-reviews.component';
import { ReviewComponent } from './components/review/review.component';
import { LocationReviewsListComponent } from './pages/location-details/location-reviews/location-reviews-list/location-reviews-list.component';
import { LocationReviewAddComponent } from './pages/location-details/location-reviews/location-review-add/location-review-add.component';
import { LocationReviewEditComponent } from './pages/location-details/location-reviews/location-review-edit/location-review-edit.component';
import { LocationOpenhoursComponent } from './pages/location-details/location-openhours/location-openhours.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { SearchSidebarComponent } from './components/search-sidebar/search-sidebar.component';

@NgModule({
  declarations: [
    MapComponent,
    LocationDetailsComponent,
    LocationServicesComponent,
    CoordinatesComponent,
    LocationReviewsComponent,
    ReviewComponent,
    LocationReviewsListComponent,
    LocationReviewAddComponent,
    LocationReviewEditComponent,
    LocationOpenhoursComponent,
    FavouriteListComponent,
    SearchSidebarComponent,
  ],
  imports: [CommonModule, MapRoutingModule, CoreModule, SharedModule],
})
export class MapModule {}
