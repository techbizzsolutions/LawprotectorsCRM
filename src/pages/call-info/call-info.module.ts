import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallInfoPage } from './call-info';

@NgModule({
  declarations: [
    CallInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CallInfoPage),
  ],
})
export class CallInfoPageModule {}
