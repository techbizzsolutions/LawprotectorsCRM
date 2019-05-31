import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimeperiodPage } from './timeperiod';

@NgModule({
  declarations: [
    TimeperiodPage,
  ],
  imports: [
    IonicPageModule.forChild(TimeperiodPage),
  ],
})
export class TimeperiodPageModule {}
