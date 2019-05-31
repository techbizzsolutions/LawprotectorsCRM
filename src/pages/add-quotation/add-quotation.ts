import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-add-quotation',
  templateUrl: 'add-quotation.html',
})
export class AddQuotationPage{
  private register: FormGroup;
  action:any;
  role:any;
  branch:any;
  orderdate: any = 'Date';
  items = [];
  totalItemamount:any = 0;
  services = [];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public events: Events,
    public alertCtrl: AlertController,
     public navParams: NavParams) {
      var res = new Date();
      let mnth = res.getMonth() + 1;
        this.orderdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
        
    this.register = this.formBuilder.group({
      party: ["", Validators.required],
      address: ["", Validators.required],
      mobile: ["", Validators.required],
      qnumber: ["", Validators.required],
      note:[""]
        });
        events.subscribe('item', (item) => {
          if(item.action === "edit")
          {
             for (let index = 0; index <  this.items.length; index++) {
                if(item.id == this.items[index].id)
                {
                  this.items[index].services = item.services;
                  this.items[index].services_name = item.services_name;
                  this.items[index].quantity = item.quantity;
                  this.items[index].gst = item.gst;
                  this.items[index].rate = item.rate;
                  this.items[index].amount = item.amount;
                  break;
                }
             }
          }
          else{
            this.items.push(item);
          }
    
          this.totalItemamount = 0;
          for (let index = 0; index < this.items.length; index++) {
             this.totalItemamount = this.totalItemamount + Number(this.items[index].amount);
          }
        });
    
  }

  itemclick(item:any) {
    this.navCtrl.push('AddproductPage',{"item":item, 'service':this.services});
  }

  delete(billitem:any)
  {
    console.log(billitem);
    let confirmAlert = this.alertCtrl.create({
      subTitle: "Do you want to delete item?",
      buttons: [
        {
          text: 'NO',
          handler: () => {
            return;
          }
        },
        {
          text: 'YES',
          handler: () => {
            var removeIndex = this.items.map(function(item) { return item.id; }).indexOf(billitem.id);
            this.items.splice(removeIndex, 1);
            this.totalItemamount = 0;
            for (let index = 0; index < this.items.length; index++) {
              this.totalItemamount = this.totalItemamount + Number(this.items[index].amount);
            }
          }
        }
      ]
    });
    confirmAlert.present();
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


  logForm()
  {
    console.log(this.branch);
    this.loader.Show("Loading...");
    var make;
    if(this.navParams.data.id)
    {
      let user = JSON.parse(localStorage.getItem('user'));
      make = {
        url:'editQuotation',
        data:{
          'roleid':user.role,
          'quotationid':this.navParams.data.id,
          'date':this.orderdate,
          'qno': this.register.value.qnumber,
          'pname': this.register.value.party,
          'paddress':this.register.value.address,
          'pmobileno':this.register.value.mobile,
          'tb_amount':this.totalItemamount,
          'note': this.register.value.note,
          'productinfo' : this.items
         }
      }
    }
    else{
      make = {
        url:'addQuatation',
        data:{ 
          'date':this.orderdate,
          'qno': this.register.value.qnumber,
          'pname': this.register.value.party,
          'paddress':this.register.value.address,
          'pmobileno':this.register.value.mobile,
          'tb_amount':this.totalItemamount,
          'note': this.register.value.note,
          'productinfo' : this.items
          }
      }
    }
    
    this.api.post(make.url, make.data).subscribe(res => {
      console.log('addRC', res);
      this.loader.Hide();
      if (res.status) {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
        let confirmAlert = this.alertCtrl.create({
          subTitle: "Do you want to print the quotatio?",
          buttons: [
            {
              text: 'NO',
              handler: () => {
                this.navCtrl.setRoot('DashboardPage');
                return;
              }
            },
            {
              text: 'YES',
              handler: () => {
                this.navCtrl.pop();
                let item = {
                  party_address: this.register.value.address,
                  party_mobile_no: this.register.value.mobile,
                  party_name: this.register.value.party,
                  productinfo: this.items,
                  qdate: this.orderdate,
                  qno:this.register.value.qnumber,
                  tbasic_amount: this.totalItemamount
                }
                this.navCtrl.push('PrintQuotationPage',item);
              }
            }
          ]
        });
        confirmAlert.present();
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

  getservice()
  {
    this.loader.Show("Loading...");
    this.api.get('viewServices').subscribe(res => {
      console.log('viewServices', res);
      this.loader.Hide();
      if (res.status) {
        this.services = res.list;
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
    console.log('ionViewDidLoad add quotation',this.navParams.data);
    this.getservice();
    if(this.navParams.data.id)
    {
      this.register = this.formBuilder.group({
        party: [this.navParams.data.party_name, Validators.required],
        address: [this.navParams.data.party_address, Validators.required],
        mobile: [this.navParams.data.party_mobile_no, Validators.required],
        qnumber: [this.navParams.data.qno, Validators.required],
        note:[this.navParams.data.note]
          });
       this.orderdate = this.navParams.data.qdate;
       this.totalItemamount = this.navParams.data.tbasic_amount;
       this.items = this.navParams.data.productinfo;
    }
  }

}
