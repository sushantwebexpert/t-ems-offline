import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenfilePage } from './openfile.page';

const routes: Routes = [
  {
    path: '',
    component: OpenfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenfilePageRoutingModule {}
