import { Component } from '@angular/core';
import { NavController, ToastController, Events, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';
import { Platform } from 'ionic-angular/platform/platform';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private register: FormGroup;
  user: any;
  role: any;
  //password: "law1234"
//phone: "8054453554"
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public navPeram: NavParams,
    public toastCtrl: ToastController,
    public events: Events,
    public plt: Platform,
    public formBuilder: FormBuilder
  ) {
    this.register = this.formBuilder.group({
      Password: ["", Validators.required],
      Username: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

  forgot()
  {
     this.navCtrl.push('ForgotPasswordPage');
  }

  logForm() {
    if(!this.role)
    {
      let toast = this.toastCtrl.create({
        message: "Please select role",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    console.log(this.register.value);
    this.loader.Show("Loading...");
    this.api.postWithoutEmp('login', {
      "roleid": this.role,
      "phone": this.register.value.Username,
      "password": this.register.value.Password
    }).subscribe(res => {
      console.log('login', res);
      this.loader.Hide();
      if (res.status) {
        res.role = this.role;
        localStorage.setItem('user', JSON.stringify(res));
        this.events.publish('user:loggedIn');
        switch (this.role) {
          case '1':
            this.navCtrl.setRoot('DashboardPage');
            break;
          case '2':
            this.navCtrl.setRoot('DashboardBranchPage');
            break;
          case '3':
            this.navCtrl.setRoot('DashboardRcPage');
            break;
          case '4':
            this.navCtrl.setRoot('DashboardTcPage');
            break;
          default:
            break;
        }
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

}