import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardBranchPage } from './dashboard-branch';

@NgModule({
  declarations: [
    DashboardBranchPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardBranchPage),
  ],
})
export class DashboardBranchPageModule {}
