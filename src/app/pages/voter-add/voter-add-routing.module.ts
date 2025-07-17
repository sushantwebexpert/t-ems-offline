import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoterAddPage } from './voter-add.page';

const routes: Routes = [
  {
    path: '',
    component: VoterAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoterAddPageRoutingModule {}
