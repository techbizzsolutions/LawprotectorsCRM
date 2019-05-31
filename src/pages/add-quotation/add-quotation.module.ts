import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddQuotationPage } from './add-quotation';

@NgModule({
  declarations: [
    AddQuotationPage,
  ],
  imports: [
    IonicPageModule.forChild(AddQuotationPage),
  ],
})
export class AddQuotationPageModule {}
