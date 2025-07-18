import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoterEditPageRoutingModule } from './voter-edit-routing.module';

import { VoterEditPage } from './voter-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    VoterEditPageRoutingModule
  ],
  declarations: [VoterEditPage]
})
export class VoterEditPageModule {}
