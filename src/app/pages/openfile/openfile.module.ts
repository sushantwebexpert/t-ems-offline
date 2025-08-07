import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenfilePageRoutingModule } from './openfile-routing.module';

import { OpenfilePage } from './openfile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenfilePageRoutingModule
  ],
  declarations: [OpenfilePage]
})
export class OpenfilePageModule {}
