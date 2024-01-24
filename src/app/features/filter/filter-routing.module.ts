import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterComponent } from './filter.component';

const routes: Routes = [
  {
    path: '',
    component: FilterComponent,
    title: 'Advanced Search',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterRoutingModule {}
