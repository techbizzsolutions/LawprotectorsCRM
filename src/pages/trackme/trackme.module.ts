import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackmePage } from './trackme';

@NgModule({
  declarations: [
    TrackmePage,
  ],
  imports: [
    IonicPageModule.forChild(TrackmePage),
  ],
})
export class TrackmePageModule {}
