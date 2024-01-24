import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterRoutingModule } from './filter-routing.module';
import { FilterComponent } from './filter.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';

@NgModule({
  declarations: [FilterComponent, FilterSidebarComponent],
  imports: [CommonModule, FilterRoutingModule, CoreModule, SharedModule],
})
export class FilterModule {}
