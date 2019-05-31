import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrintQuotationPage } from './print-quotation';

@NgModule({
  declarations: [
    PrintQuotationPage,
  ],
  imports: [
    IonicPageModule.forChild(PrintQuotationPage),
  ],
})
export class PrintQuotationPageModule {}
