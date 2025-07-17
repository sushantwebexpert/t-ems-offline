import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoterViewPageRoutingModule } from './voter-view-routing.module';

import { VoterViewPage } from './voter-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoterViewPageRoutingModule
  ],
  declarations: [VoterViewPage]
})
export class VoterViewPageModule {}
