import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ItemSliding } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-list-user',
  templateUrl: 'list-user.html',
})
export class ListUserPage {
  users = [];
  branchs=[];
  branch:any;
  role:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListUserPage');
    this.getBranch();
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

  itemclick(item)
  {
       this.getDataById(item.id);
  }

  getDataById(id)
    {
      this.loader.Show("Loading...");
      this.api.postWithoutEmp('getUserListById', {
        "userid": id
      }).subscribe(res => {
        console.log('getUserListById', res);
        this.loader.Hide();
        if (res.status) {
          this.navCtrl.push('AddUserPage',res.list[0]);
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

  delete(item:any,slidingItem: ItemSliding)
  {
      let confirmAlert = this.alertCtrl.create({
      subTitle: "Do you want to delete User?",
      buttons: [
        {
          text: 'NO',
          handler: () => {
            slidingItem.close();
            return;
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.deleteBranch(item.id);
          }
        }
      ]
    });
    confirmAlert.present();
  }

  deleteBranch(id)
  {
    this.loader.Show("Loading...");
    this.api.postWithoutEmp('deleteUser', {
      "userid": id
    }).subscribe(res => {
      console.log('deleteUser', res);
      this.loader.Hide();
      if (res.status) {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.view();
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
    if(!this.branch)
    {
      let toast = this.toastCtrl.create({
        message: "Please select branch",
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
    this.api.postWithoutEmp('getUserList', {
      "branchid": this.branch,
      "roleid":this.role
    }).subscribe(res => {
      console.log('getUserList', res);
      this.loader.Hide();
      if (res.status) {
        this.users = res.userdata;
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
