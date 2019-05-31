import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-set-target',
  templateUrl: 'set-target.html',
})
export class SetTargetPage {
  users = [];
  user: any;
  From: any = 'From';
  To: any = 'To';
  anArray: any = [];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, public navParams: NavParams) {
  }

  select(emp) {
    console.log(emp);
    this.anArray =[];
    for (let index = 0; index < emp.branchinfo.length; index++) {
      this.anArray.push(
        {
          'branchid': emp.branchinfo[index].branch_id,
          'lable':emp.branchinfo[index].branch_name,
          'targetval':''
        });
    }
   
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackmePage');
    this.getBranch();
  }

  getBranch() {
    this.loader.Show("Loading...");
    this.api.get('viewUsers').subscribe(res => {
      console.log('viewUsers', res);
      this.loader.Hide();
      if (res.status) {
        this.users = res.list;
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


  view() {
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

    if (!this.user) {
      let toast = this.toastCtrl.create({
        message: "Please select Employee",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    var blank = this.anArray.filter((item) => {
       if(item.targetval == "")
       {
         return true;
       }
       else{
          
       }
    });

    if(blank.length)
    {
      let toast = this.toastCtrl.create({
        message: "Please Enter target",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    this.loader.Show("Loading...");
    this.api.postWithoutEmp('setUserTarget', {
      'fromdate': this.From,
      'todate': this.To,
      'userid':this.user,
      'target':this.anArray 
    }).subscribe(res => {
      console.log('setUserTarget', res);
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


}
