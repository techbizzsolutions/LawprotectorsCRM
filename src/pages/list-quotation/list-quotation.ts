import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ItemSliding } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-list-quotation',
  templateUrl: 'list-quotation.html',
})
export class ListQuotationPage {
quotations = [];
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
     public navParams: NavParams) {
    
  }

  itemclick(item,slidingItem: ItemSliding)
  {
      slidingItem.close();
      this.navCtrl.push('AddQuotationPage',item);
  }

  print(item,slidingItem: ItemSliding)
  {
      slidingItem.close();
      this.navCtrl.push('PrintQuotationPage',item);
  }

  delete(item:any,slidingItem: ItemSliding)
  {
      let confirmAlert = this.alertCtrl.create({
      subTitle: "Do you want to delete Quotation?",
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
    this.api.postWithoutEmp('deleteQuatation', {
      "qid": id
    }).subscribe(res => {
      console.log('deleteQuatation', res);
      this.loader.Hide();
      if (res.status) {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.quotations = [];
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
    console.log('ionViewDidLoad ListQuotationPage');
    let user = JSON.parse(localStorage.getItem('user'));
      switch (user.role) {
        case '1':
         this.getQuotation();
          break;
        case '2':
        case '3':
        case '4':
        this.getQuotationByid();
          break;
        default:
          break;
      }
  }

  getQuotation()
  {
    this.loader.Show("Loading...");
    this.api.get('viewAllQuatation').subscribe(res => {
      console.log('viewAllQuatation', res);
      this.loader.Hide();
      if (res.status) {
        this.quotations = res.list;
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

  getQuotationByid()
  {
    this.loader.Show("Loading...");
    this.api.post('viewUserQuatation',{}).subscribe(res => {
      console.log('viewUserQuatation', res);
      this.loader.Hide();
      if (res.status) {
        this.quotations = res.list;
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
