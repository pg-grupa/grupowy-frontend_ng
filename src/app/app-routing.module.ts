import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheInitializedResolver } from './core/resolvers/cache-initialized.resolver';
import { LocationResolver } from './core/resolvers/location.resolver';
import { CoordinatesModalComponent } from './pages/map-page/coordinates-modal/coordinates-modal.component';
import { FilterModalComponent } from './pages/map-page/filter-modal/filter-modal.component';
import { LocationModalComponent } from './pages/map-page/location-modal/location-modal.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { NavigationPageComponent } from './pages/navigation-page/navigation-page.component';

const routes: Routes = [
  {
    path: '',
    resolve: [CacheInitializedResolver],
    children: [
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
      {
        path: 'map',
        component: MapPageComponent,
        children: [
          {
            path: 'location/:id',
            component: LocationModalComponent,
            resolve: {
              location: LocationResolver,
            },
          },
          {
            path: 'coordinates/:coords',
            component: CoordinatesModalComponent,
          },
          {
            path: 'filters',
            component: FilterModalComponent,
          },
        ],
      },
      {
        path: 'navigate',
        component: NavigationPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
