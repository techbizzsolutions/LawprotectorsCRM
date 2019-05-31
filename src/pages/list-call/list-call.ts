import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-list-call',
  templateUrl: 'list-call.html',
})
export class ListCallPage {
  call =[];
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
  }

  itemclick(item)
  {
      this.navCtrl.push('AddcallPage',item);
  }

  delete(item:any,slidingItem: ItemSliding)
  {
      let confirmAlert = this.alertCtrl.create({
      subTitle: "Do you want to delete Call?",
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
    this.api.postWithoutEmp('deleteCallStatus', {
      "callinfoid": id
    }).subscribe(res => {
      console.log('deleteCallStatus', res);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListBranchPage');
    this.getBranch();
  }

  getBranch()
  {
    this.loader.Show("Loading...");
    this.api.get('viewCallStatus').subscribe(res => {
      console.log('viewCallStatus', res);
      this.loader.Hide();
      if (res.status) {
        this.call = res.list;
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

