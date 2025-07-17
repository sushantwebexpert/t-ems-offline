import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoterEditPage } from './voter-edit.page';

const routes: Routes = [
  {
    path: '',
    component: VoterEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoterEditPageRoutingModule {}
