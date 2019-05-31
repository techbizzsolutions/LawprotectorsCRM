import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';


@IonicPage()
@Component({
  selector: 'page-rc-report',
  templateUrl: 'rc-report.html',
})
export class RcReportPage {
  users = [];
  user:any;
  From:any = 'From';
  To:any = 'To';
  lists=[];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, public navParams: NavParams) {
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackmePage');
  }

  
  view()
  {
    if(this.From =="From")
    {
      let toast = this.toastCtrl.create({
        message: "Please select From Date",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    if(this.To == "To")
    {
      let toast = this.toastCtrl.create({
        message: "Please select To Date",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(!this.user)
    {
      let toast = this.toastCtrl.create({
        message: "Please select Employee",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    this.loader.Show("Loading...");
    this.api.postWithoutEmp('viewUser', {
     
    }).subscribe(res => {
      console.log('deleteBranch', res);
      this.loader.Hide();
      if (res.status) {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.ionViewDidLoad();
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

