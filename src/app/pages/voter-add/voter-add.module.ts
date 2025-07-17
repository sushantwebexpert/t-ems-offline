import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoterAddPageRoutingModule } from './voter-add-routing.module';

import { VoterAddPage } from './voter-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoterAddPageRoutingModule
  ],
  declarations: [VoterAddPage]
})
export class VoterAddPageModule {}
