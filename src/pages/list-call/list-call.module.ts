import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListCallPage } from './list-call';

@NgModule({
  declarations: [
    ListCallPage,
  ],
  imports: [
    IonicPageModule.forChild(ListCallPage),
  ],
})
export class ListCallPageModule {}
