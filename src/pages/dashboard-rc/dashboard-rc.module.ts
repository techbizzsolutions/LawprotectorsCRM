import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardRcPage } from './dashboard-rc';

@NgModule({
  declarations: [
    DashboardRcPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardRcPage),
  ],
})
export class DashboardRcPageModule {}
