import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

@IonicPage()
@Component({
  selector: 'page-trackme',
  templateUrl: 'trackme.html',
})
export class TrackmePage {
  users = [];
  branchs=[];
  emps = [];
  roles = [];
  branch:any;
  role:any;
  emp:any;
  user:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    private nativeGeocoder: NativeGeocoder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, public navParams: NavParams) {
      this.user = JSON.parse(localStorage.getItem('user'));
      switch (this.user.role) {
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
        this.addIdasBranch(this.user.result[0].branchinfo);
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
        this.addIdasBranch(this.user.result[0].branchinfo);
        this.roles = [
        {
          'name':'RC',
          'id':'3'
        }];
          break;
        case '4':
        this.addIdasBranch(this.user.result[0].branchinfo);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackmePage');
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

  getCity(lati,long)
  {  
      this.nativeGeocoder.reverseGeocode(lati, long)
        .then((result) =>
        {
          console.log(JSON.stringify(result[0]))
        })
        .catch((error: any) => console.log(error));
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
    if(!this.branch && !this.role && !this.emp)
    {
      let toast = this.toastCtrl.create({
        message: "Please select at least one filter",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    this.loader.Show("Loading...");
    this.api.postWithoutEmp('trackingApi', {
      "branchid": this.branch,
      "roleid":this.role,
      "userid":this.emp
    }).subscribe(res => {
      console.log('deleteBranch', res);
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


}
