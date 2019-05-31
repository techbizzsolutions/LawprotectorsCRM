import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotVisitInfoPage } from './spot-visit-info';

@NgModule({
  declarations: [
    SpotVisitInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotVisitInfoPage),
  ],
})
export class SpotVisitInfoPageModule {}
