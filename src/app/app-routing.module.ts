import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CacheInitializedResolver } from './core/resolvers/cache-initialized.resolver';
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
