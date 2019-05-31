import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListTargetPage } from './list-target';

@NgModule({
  declarations: [
    ListTargetPage,
  ],
  imports: [
    IonicPageModule.forChild(ListTargetPage),
  ],
})
export class ListTargetPageModule {}
