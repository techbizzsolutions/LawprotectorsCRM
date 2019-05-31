import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyOtpPage } from './verify-otp';

@NgModule({
  declarations: [
    VerifyOtpPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyOtpPage),
  ],
})
export class VerifyOtpPageModule {}
