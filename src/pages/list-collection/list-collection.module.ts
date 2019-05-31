import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListCollectionPage } from './list-collection';

@NgModule({
  declarations: [
    ListCollectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ListCollectionPage),
  ],
})
export class ListCollectionPageModule {}
