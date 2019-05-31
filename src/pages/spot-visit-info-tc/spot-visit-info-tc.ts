import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-spot-visit-info-tc',
  templateUrl: 'spot-visit-info-tc.html',
})
export class SpotVisitInfoTcPage {
  private register: FormGroup;
  rc = [];
  calls = [];
  selectcall:any;
  selectrc:any;
  services= [];
  service:any;
  appdate: any = 'Appointment Date';
  apptime: any = 'Appointment Time';
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
     public navParams: NavParams) {
    this.register = this.formBuilder.group({
      party_name: ["", Validators.required],
      mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(10)])],
      email: ["", Validators.required],
      cityname:["", Validators.required],
      note: [""]
    });
  }

  date() {
    this.api.opencalQR().then(res => {
      let mnth = res.getMonth() + 1;
        this.appdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
    })
    .catch(err => {
        var res = new Date();
        let mnth = res.getMonth() + 1;
          this.appdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
      });
  }

  time() {
    this.api.time().then(res => {
      this.apptime =res.getHours() + ":" + res.getMinutes();
    })
    .catch(err => {
          var res = new Date();
          this.apptime =res.getHours() + ":" + res.getMinutes();
      });
  }

  getCall()
  {
    this.loader.Show("Loading...");
    this.api.get('viewCallStatus').subscribe(res => {
      console.log('viewCallStatus', res);
      this.loader.Hide();
      if (res.status) {
        this.calls = res.list;
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
        this.getCall();
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

  getBranch()
  {
    this.loader.Show("Loading...");
    this.api.get('viewRC').subscribe(res => {
      console.log('viewRC', res);
      this.loader.Hide();
      if (res.status) {
        this.rc = res.list;
        this.getservice();
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
    
    if(!this.selectcall)
    {
      let toast = this.toastCtrl.create({
        message: "Please select call status",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    if(!this.selectrc)
    {
      let toast = this.toastCtrl.create({
        message: "Please select RC name",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    this.loader.Show("Loading...");
    var make;
    if(this.navParams.data.id && !this.navParams.data.action)
    {
      make = {
        url:'updatecallinfo',
        data:{
          "call_infoid":this.navParams.data.id,
          "party_name": this.register.value.party_name,
          "city": this.register.value.cityname,
          "email_id": this.register.value.email,
          "call_status": this.selectcall,
          "interested": this.service,
          "lead_assigned_rc":this.selectrc,
          "appointment_date": this.appdate,
          "appointment_time": this.apptime,
          "mobile": this.register.value.mobile,
          "note": this.register.value.note
        }
      }
    }
    else{
      make = {
        url:'addcallinfo',
        data:{
          "party_name": this.register.value.party_name,
          "city": this.register.value.cityname,
          "email_id": this.register.value.email,
          "call_status": this.selectcall,
          "interested": (this.service)?this.service:"",
          "lead_assigned_rc":this.selectrc,
          "appointment_date": (this.appdate =="Appointment Date")?"":this.appdate,
          "appointment_time": (this.apptime == "Appointment Time")?"":this.apptime,
          "mobile": this.register.value.mobile,
          "note": this.register.value.note
          }
      }
    }
    
    this.api.post(make.url, make.data).subscribe(res => {
      console.log('addCallStatus', res);
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

  getEmp()
  {
    this.loader.Show("Loading...");
    this.api.postWithoutEmp('getUserByRoleId', {
      "roleid":'3'
    }).subscribe(res => {
      console.log('viewUsers', res);
      this.loader.Hide();
      if (res.status) {
        this.rc = res.list;
        this.getservice();
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
    console.log('ionViewDidLoad tc',this.navParams.data);
    this.getEmp();
    if(this.navParams.data.id)
    {
      if(this.navParams.data.action)
      {
        this.register = this.formBuilder.group({
          party_name: [this.navParams.data.party_name, Validators.required],
          mobile : [this.navParams.data.phone,Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(10)])],
          email: [this.navParams.data.email_id, Validators.required],
          cityname:[this.navParams.data.city, Validators.required],
          note: [""]
        });
      }
      else{
        this.register = this.formBuilder.group({
          party_name: [this.navParams.data.party_name, Validators.required],
          mobile : [this.navParams.data.phone,Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(10)])],
          email: [this.navParams.data.email_id, Validators.required],
          cityname:[this.navParams.data.city, Validators.required],
          note: [this.navParams.data.note]
        });
        this.appdate = this.navParams.data.appointment_date;
        this.apptime = this.navParams.data.appointment_time;
        this.selectrc = this.navParams.data.lead_assigned_rc;
        this.service = this.navParams.data.interested;
        this.selectcall = this.navParams.data.call_status;
      }
      
    }
  }

}
