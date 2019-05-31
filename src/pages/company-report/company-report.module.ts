import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyReportPage } from './company-report';

@NgModule({
  declarations: [
    CompanyReportPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyReportPage),
  ],
})
export class CompanyReportPageModule {}
