import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error.component';
import { Error0Component } from './pages/error0/error0.component';
import { Error404Component } from './pages/error404/error404.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorComponent,
    children: [
      {
        path: '0',
        component: Error0Component,
      },
      {
        path: '404',
        component: Error404Component,
      },
      {
        path: '**',
        component: Error404Component,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
