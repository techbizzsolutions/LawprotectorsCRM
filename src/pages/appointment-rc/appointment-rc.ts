import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-appointment-rc',
  templateUrl: 'appointment-rc.html',
})
export class AppointmentRcPage {
  lists=[];
  spotInfo = [];
  From:any = 'From';
  To:any = 'To';
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, public navParams: NavParams) {
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackmePage');
  }

  opencal(type)
  {
      this.api.opencalQR().then(res =>{
        if(type == 'From')
        {
          let mnth = res.getMonth() + 1;
          this.From = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
        }
        else{
            let mnth = res.getMonth() + 1;
            this.To =  res.getDate()+"-"+mnth +"-"+ res.getFullYear();
          }
     })
     .catch(err=>{
      var res = new Date();
      if(type == 'From')
        {
          let mnth = res.getMonth() + 1;
          this.From = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
        }
        else{
            let mnth = res.getMonth() + 1;
            this.To =  res.getDate()+"-"+mnth +"-"+ res.getFullYear();
          }
     });
  }

  getBranch()
  {
    this.loader.Show("Loading...");
    let user = JSON.parse(localStorage.getItem('user'));
    this.api.postWithoutEmp('getAppointment',{
      'fromdate': this.From,
      'todate': this.To,
      'lead_assigned':user.result[0].id
    }).subscribe(res => {
      console.log('getspotinfo', res);
      this.loader.Hide();
      if (res.status) {
        this.lists = res.userdata;
        this.getSpotinfo();
      }
      else {
        this.getSpotinfo();
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

  getSpotinfo()
  {
    this.loader.Show("Loading...");
    this.api.post('getspotinfodatewise',{
      'fromdate': this.From,
      'todate': this.To
    }).subscribe(res => {
      console.log('getspotinfodatewise', res);
      this.loader.Hide();
      if (res.status) {
        this.spotInfo = res.userdata;
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
