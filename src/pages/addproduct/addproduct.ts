import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html',
})
export class AddproductPage  {
  private register: FormGroup;
  product:any;
  products = [];
  amount:any = 0;
  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public events: Events,
     public navParams: NavParams) {
    this.register = this.formBuilder.group({
      quantity: ["", Validators.required],
      rate: ["", Validators.required],
      gst: ["", Validators.required]
        });
  }

  logForm()
  {
    if(!this.product)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Product Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    this.register.value.services = this.product.id;
    this.register.value.services_name = this.product.services_name;
    var basic = Math.round(this.register.value.quantity * this.register.value.rate);
    this.register.value.amount =  Math.round(basic + (basic * this.register.value.gst)/100);
    if(this.navParams.data.item)
    {
      this.register.value.action = 'edit';
      this.register.value.id = this.navParams.data.item.id;
      this.events.publish('item',this.register.value);
      this.navCtrl.pop();
    }
    else{
      this.register.value.id = new Date().getTime();
      this.register.value.action = 'new';
      this.events.publish('item',this.register.value);
      this.navCtrl.pop();
    }
   }

  compareFncom(e1, e2): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  cal()
  {
     var basic = Math.round(this.register.value.quantity * this.register.value.rate);
     this.amount =  Math.round(basic + (basic * this.register.value.gst)/100);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad add product',this.navParams.data.item);
    this.products = this.navParams.data.service;
    if(this.navParams.data.item)
    {
      this.register = this.formBuilder.group({
        quantity: [this.navParams.data.item.quantity, Validators.required],
        rate: [this.navParams.data.item.rate, Validators.required],
        gst: [this.navParams.data.item.gst, Validators.required]
          });
        this.product =   {
          "id":this.navParams.data.item.services,
          "services_name": this.navParams.data.item.services_name
        };
    }
  }

}
