import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-addcall',
  templateUrl: 'addcall.html',
})
export class AddcallPage {
  private register: FormGroup;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
     public navParams: NavParams) {
    this.register = this.formBuilder.group({
      callvisit: ["", Validators.required]
    });
  }

  logForm()
  {
    this.loader.Show("Loading...");
    var make;
    if(this.navParams.data.id)
    {
      make = {
        url:'updateCallStatus',
        data:{
          'callinfoid':this.navParams.data.id,
          "callinfo": this.register.value.callvisit        }
      }
    }
    else{
      make = {
        url:'addCallStatus',
        data:{
          "callinfo": this.register.value.callvisit        }
      }
    }
    
    this.api.postWithoutEmp(make.url, make.data).subscribe(res => {
      console.log('addCallStatus', res);
      this.loader.Hide();
      if (res.status) {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.navCtrl.setRoot('DashboardPage');
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
    if(this.navParams.data.id)
    {
      this.register = this.formBuilder.group({
        callvisit: [this.navParams.data.call_status_info, Validators.required],
        });
    }
  }

}
