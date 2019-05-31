import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddservicePage } from './addservice';

@NgModule({
  declarations: [
    AddservicePage,
  ],
  imports: [
    IonicPageModule.forChild(AddservicePage),
  ],
})
export class AddservicePageModule {}
