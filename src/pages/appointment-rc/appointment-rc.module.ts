import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentRcPage } from './appointment-rc';

@NgModule({
  declarations: [
    AppointmentRcPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentRcPage),
  ],
})
export class AppointmentRcPageModule {}
