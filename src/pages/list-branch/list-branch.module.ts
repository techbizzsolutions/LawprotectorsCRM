import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListBranchPage } from './list-branch';

@NgModule({
  declarations: [
    ListBranchPage,
  ],
  imports: [
    IonicPageModule.forChild(ListBranchPage),
  ],
})
export class ListBranchPageModule {}
