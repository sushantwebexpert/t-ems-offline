import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoterViewPage } from './voter-view.page';

const routes: Routes = [
  {
    path: '',
    component: VoterViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoterViewPageRoutingModule {}
