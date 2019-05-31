import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-verify-otp',
  templateUrl: 'verify-otp.html',
})
export class VerifyOtpPage {
  otp:any;
  mobile:any;
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage',this.navParams.data);
    this.mobile = this.navParams.data;
  }

  resendOtp()
  {
      
  }

  
  verifyOtp()
  {
    if(this.otp)
    {
      if(this.otp)
      {
        this.navCtrl.setRoot('ResetPasswordPage');
      }
      else{
        let toast = this.toastCtrl.create({
          message: 'Please enter correct otp',
          position: 'top',
          duration: 3000
        });
        toast.present();
      }
      
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Please enter otp',
        position: 'top',
        duration: 3000
      });
      toast.present();
    }
  }

  editnumber()
  {
    this.navCtrl.setRoot('ForgotPasswordPage');
  }
}
