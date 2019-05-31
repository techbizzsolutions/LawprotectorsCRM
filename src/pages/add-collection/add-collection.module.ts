import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCollectionPage } from './add-collection';

@NgModule({
  declarations: [
    AddCollectionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCollectionPage),
  ],
})
export class AddCollectionPageModule {}
