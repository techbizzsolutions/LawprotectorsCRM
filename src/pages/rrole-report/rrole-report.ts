import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-rrole-report',
  templateUrl: 'rrole-report.html',
})
export class RroleReportPage {
  role:any;
  roles = [];
  From:any = 'From';
  To:any = 'To';
  lists=[];
  branchs = [];
  branch:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, public navParams: NavParams) {
      let user = JSON.parse(localStorage.getItem('user'));
      switch (user.role) {
        case '1':
          this.getBranch();
          this.roles = [{
            'name':'Admin',
            'id':'1'
          },
          {
            'name':'Branch Head',
            'id':'2'
          },
          {
            'name':'RC',
            'id':'3'
          },
          {
            'name':'TC',
            'id':'4'
          }];
          break;
        case '2':
        this.addIdasBranch(user.result[0].branchinfo);
        this.roles = [
        {
          'name':'RC',
          'id':'3'
        },
        {
          'name':'TC',
          'id':'4'
        }];
          break;
        case '3':
        this.addIdasBranch(user.result[0].branchinfo);
        this.roles = [
        {
          'name':'RC',
          'id':'3'
        }];
          break;
        case '4':
        this.addIdasBranch(user.result[0].branchinfo);
        this.roles = [
        {
          'name':'TC',
          'id':'4'
        }];
          break;
        default:
          break;
      }
  }

  addIdasBranch(branchs)
  {
    branchs.forEach(element => {
      element.id = element.branch_id;
     });
     this.branchs = branchs;
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

  
  getBranch()
  {
    this.loader.Show("Loading...");
    this.api.get('viewBranch').subscribe(res => {
      console.log('viewBranch', res);
      this.loader.Hide();
      if (res.status) {
        this.branchs = res.list;
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

    if(!this.branch)
    {
      let toast = this.toastCtrl.create({
        message: "Please select role",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

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

    this.loader.Show("Loading...");
    this.api.postWithoutEmp('branchWiseReport', {
     'branchid':this.branch,
     'fromdate':this.From,
     'todate':this.To,
     'roleid':this.role
    }).subscribe(res => {
      console.log('branchWiseReport', res);
      this.loader.Hide();
      if (res.status) {
         this.lists = res.list;
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


