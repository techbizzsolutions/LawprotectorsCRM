import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListQuotationPage } from './list-quotation';

@NgModule({
  declarations: [
    ListQuotationPage,
  ],
  imports: [
    IonicPageModule.forChild(ListQuotationPage),
  ],
})
export class ListQuotationPageModule {}
