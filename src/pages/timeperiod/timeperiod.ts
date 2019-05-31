import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';


@IonicPage()
@Component({
  selector: 'page-timeperiod',
  templateUrl: 'timeperiod.html',
})
export class TimeperiodPage {
  private register: FormGroup;
  From: any = 'From';
  To: any = 'To';
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
     public navParams: NavParams) {
    this.register = this.formBuilder.group({
      title: ["", Validators.required]
    });
  }

  opencal(type) {
    this.api.opencalQR().then(res => {
      if (type == 'From') {
        let mnth = res.getMonth() + 1;
        this.From = res.getDate() + "-" + mnth + "-" + res.getFullYear();
      }
      else {
        let mnth = res.getMonth() + 1;
        this.To = res.getDate() + "-" + mnth + "-" + res.getFullYear();
      }
    })
      .catch(err => {
        var res = new Date();
        if (type == 'From') {
          let mnth = res.getMonth() + 1;
          this.From = res.getDate() + "-" + mnth + "-" + res.getFullYear();
        }
        else {
          let mnth = res.getMonth() + 1;
          this.To = res.getDate() + "-" + mnth + "-" + res.getFullYear();
        }
      });
  }

  logForm()
  {
    this.loader.Show("Loading...");
    var make;
    if(this.navParams.data.id)
    {
      make = {
        url:'updatePeriod',
        data:{
          pid:this.navParams.data.id,
          title:this.register.value.title,
          to_date:this.To,
          from_date:this.From
               }
      }
    }
    else{
      make = {
        url:'addPeriod',
        data:{
          title:this.register.value.title,
          to_date:this.To,
          from_date:this.From
          }
      }
    }
    
    this.api.postWithoutEmp(make.url, make.data).subscribe(res => {
      console.log('addPeriod', res);
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
        title: [this.navParams.data.title, Validators.required],
        });
      this.From =   this.navParams.data.from_date;
      this.To = this.navParams.data.to_date;
    }
  }

}
