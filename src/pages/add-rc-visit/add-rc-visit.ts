import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-add-rc-visit',
  templateUrl: 'add-rc-visit.html',
})
export class AddRcVisitPage {
  private register: FormGroup;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
     public navParams: NavParams) {
    this.register = this.formBuilder.group({
      rcvisit: ["", Validators.required]
    });
  }

  logForm()
  {
    this.loader.Show("Loading...");
    var make;
    if(this.navParams.data.id)
    {
      make = {
        url:'updateRC',
        data:{
          'rcid':this.navParams.data.id,
          "rcinfo": this.register.value.rcvisit        }
      }
    }
    else{
      make = {
        url:'addRC',
        data:{
          "rcinfo": this.register.value.rcvisit        }
      }
    }
    
    this.api.postWithoutEmp(make.url, make.data).subscribe(res => {
      console.log('addRC', res);
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
        rcvisit: [this.navParams.data.rc_status_info, Validators.required],
        });
    }
  }

}
