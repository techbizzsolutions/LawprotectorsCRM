import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardTcPage } from './dashboard-tc';

@NgModule({
  declarations: [
    DashboardTcPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardTcPage),
  ],
})
export class DashboardTcPageModule {}
