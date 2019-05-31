import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BranchReportPage } from './branch-report';

@NgModule({
  declarations: [
    BranchReportPage,
  ],
  imports: [
    IonicPageModule.forChild(BranchReportPage),
  ],
})
export class BranchReportPageModule {}
