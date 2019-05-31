import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-addservice',
  templateUrl: 'addservice.html',
})
export class AddservicePage  {
  private register: FormGroup;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
     public navParams: NavParams) {
    this.register = this.formBuilder.group({
      service: ["", Validators.required],
      fees: ["", Validators.required],
      rate: ["", Validators.required]
    });
  }

  logForm()
  {
    this.loader.Show("Loading...");
    var make;
    if(this.navParams.data.id)
    {
      make = {
        url:'updateService',
        data:{
          'serviceid':this.navParams.data.id,
          "servicename": this.register.value.service,
          "servicerate": this.register.value.rate,
          "govt_fee":this.register.value.fees
        }
      }
    }
    else{
      make = {
        url:'addService',
        data:{
          "services": this.register.value.service,
          "service_rate": this.register.value.rate,
          "govt_fee":this.register.value.fees
        }
      }
    }
    this.api.postWithoutEmp(make.url, make.data).subscribe(res => {
      console.log('addService', res);
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
        service: [this.navParams.data.services_name, Validators.required],
        fees: [this.navParams.data.govt_fee, Validators.required],
        rate: [this.navParams.data.services_rate, Validators.required]
        });
    }
  }

}
