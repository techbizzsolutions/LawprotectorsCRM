import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-addtarget',
  templateUrl: 'addtarget.html',
})
export class AddtargetPage  {
  periods = [];
  time:any;
  branchs=[];
  emps = [];
  roles = [];
  branch:any;
  role:any;
  emp:any;
  user:any;
  private register: FormGroup;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, public navParams: NavParams) {
      this.register = this.formBuilder.group({
        amount: ["", Validators.required]
      });
      this.user = JSON.parse(localStorage.getItem('user'));
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
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackmePage', this.navParams.data);
    if(this.navParams.data.id)
    {
      this.register = this.formBuilder.group({
        amount: [this.navParams.data.target, Validators.required]
      });
      this.branch = this.navParams.data.branch_id;
      this.emp = this.navParams.data.user_id;
      this.time =
      {
          "id":this.navParams.data.pid,
          "from_date":this.navParams.data.from_date,
          "to_date":this.navParams.data.to_date
      } 
      this.role = this.navParams.data.roleid;
      this.getPeriod();
    }
    else{
      this.getPeriod();
    }

  }

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  changeBranch(branch)
  {
    console.log(branch);
    if(this.branch && this.role)
    {
      this.getEmp(this.branch,this.role);
    }
  }

  changeRole(role)
  {
    console.log(role);
    if(this.branch && this.role)
    {
      this.getEmp(this.branch,this.role);
    }
  }

  getEmp(branch,role)
  {
    this.loader.Show("Loading...");
    this.api.postWithoutEmp('getUserList', {
      "branchid": branch,
      "roleid":role
    }).subscribe(res => {
      console.log('viewUsers', res);
      this.loader.Hide();
      if (res.status) {
        this.emps = res.userdata;
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
    this.api.get('viewBranch').subscribe(res => {
      console.log('viewBranch', res);
      this.loader.Hide();
      if (res.status) {
        this.branchs = res.list;
        if(this.navParams.data.id)
        {
          this.getEmp(this.branch,this.role);
        }
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

  getPeriod()
  {
    this.loader.Show("Loading...");
    this.api.get('viewPeriod').subscribe(res => {
      console.log('viewPeriod', res);
      this.loader.Hide();
      if (res.status) {
        this.periods = res.list;
        this.getBranch();
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
    if(!this.time)
    {
      let toast = this.toastCtrl.create({
        message: "Please select time period",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    if(!this.branch)
    {
      let toast = this.toastCtrl.create({
        message: "Please select Branch",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    if(!this.emp)
    {
      let toast = this.toastCtrl.create({
        message: "Please select emp",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    this.loader.Show("Loading...");
    var make;
    if(this.navParams.data.id)
    {
      make = {
        url:'updateTarget',
        data:{
          'tid': this.navParams.data.id,
          'fromdate': this.time.from_date,
          'todate': this.time.to_date,
          'pid': this.time.id,
          'roleid': this.role,
          'branchid': this.branch,
          'userid':this.emp,
          'amount':this.register.value.amount
        }
      }
    }
    else{
      make = {
        url:'setUserTarget',
        data:{
          'fromdate': this.time.from_date,
          'todate': this.time.to_date,
          'pid': this.time.id,
          'roleid': this.role,
          'branchid': this.branch,
          'userid':this.emp,
          'amount':this.register.value.amount
        }
      }
    }

    this.api.postWithoutEmp(make.url, make.data).subscribe(res => {
      console.log('setUserTarget', res);
      this.loader.Hide();
      if (res.status) {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.register.reset();
        if(this.navParams.data.id)
        {
          this.navCtrl.setRoot('DashboardPage');
        }
        
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
