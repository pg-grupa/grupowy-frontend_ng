import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { FiltersComponent } from './pages/filters/filters.component';
import { LocationServicesComponent } from './pages/location-details/location-services/location-services.component';
import { CoordinatesComponent } from './pages/coordinates/coordinates.component';
import { LocationReviewsComponent } from './pages/location-details/location-reviews/location-reviews.component';
import { ReviewComponent } from './pages/location-details/location-reviews/review/review.component';

@NgModule({
  declarations: [
    MapComponent,
    LocationDetailsComponent,
    FiltersComponent,
    LocationServicesComponent,
    CoordinatesComponent,
    LocationReviewsComponent,
    ReviewComponent,
  ],
  imports: [CommonModule, MapRoutingModule, CoreModule, SharedModule],
})
export class MapModule {}
