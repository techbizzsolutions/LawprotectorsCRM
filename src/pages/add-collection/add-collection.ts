import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-add-collection',
  templateUrl: 'add-collection.html',
})
export class AddCollectionPage {
  private register: FormGroup;
  branchs=[];
  branch:any;
  orderdate: any = 'Date';
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
     public navParams: NavParams) {
      var res = new Date();
      let mnth = res.getMonth() + 1;
        this.orderdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
        
    this.register = this.formBuilder.group({
      fees: ["", Validators.required],
      rate: ["", Validators.required]
    });
    let user = JSON.parse(localStorage.getItem('user'));
    switch (user.role) {
      case '1':
        this.getBranch();
        break;
      case '2':
      this.addIdasBranch(user.result[0].branchinfo);
        break;
      case '3':
      this.addIdasBranch(user.result[0].branchinfo);
        break;
      case '4':
      this.addIdasBranch(user.result[0].branchinfo);
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


  logForm()
  {
    this.loader.Show("Loading...");
    var make;
    if(this.navParams.data.id)
    {
      make = {
        url:'updateCollection',
        data:{
          "cid":this.navParams.data.id,
          "branchid": this.branch,
          "date": this.orderdate,
          "govt_fee": this.register.value.fees,
          "lpfee": this.register.value.rate
        }
      }
    }
    else{
      make = {
        url:'addCollection',
        data:{
          "branchid": this.branch,
          "date": this.orderdate,
          "govt_fee": this.register.value.fees,
          "lpfee": this.register.value.rate
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

  opencal() {
    this.api.opencalQR().then(res => {
      let mnth = res.getMonth() + 1;
        this.orderdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();

    })
    .catch(err => {
        var res = new Date();
        let mnth = res.getMonth() + 1;
          this.orderdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage',this.navParams.data);
    if(this.navParams.data.id)
    {
      this.register = this.formBuilder.group({
        fees: [this.navParams.data.govt_fee, Validators.required],
        rate: [this.navParams.data.lpfee, Validators.required]
        });
        this.orderdate = this.navParams.data.date;
        this.branch = this.navParams.data.branch_id;
    }
  }

}
