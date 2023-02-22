import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { FilterMenuComponent } from './components/filter-menu/filter-menu.component';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

@NgModule({
  declarations: [SearchComponent, FilterMenuComponent, SearchbarComponent],
  imports: [CommonModule, SearchRoutingModule],
})
export class SearchModule {}
