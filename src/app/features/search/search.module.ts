import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { FilterMenuComponent } from './components/filter-menu/filter-menu.component';
import { TypeSelectorComponent } from './components/type-selector/type-selector.component';

@NgModule({
  declarations: [SearchComponent, FilterMenuComponent, TypeSelectorComponent],
  imports: [CommonModule, SearchRoutingModule],
})
export class SearchModule {}
