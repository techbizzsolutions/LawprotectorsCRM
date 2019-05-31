import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage  {
  private register: FormGroup;
  action:any=false;
  role:any;
  branch:any;
  branchs =[];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
     public navParams: NavParams) {
    this.register = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      city: ["", Validators.required],
      mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(10)])],
      Password: ["", Validators.required],
      ConfirmPassword: ["", Validators.required]
        });
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
    console.log(this.branch);
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
    if(this.register.value.Password != this.register.value.ConfirmPassword)
    {
      let toast = this.toastCtrl.create({
        message: "Password does not match",
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
        url:'updateUser',
        data:{
          userid:this.navParams.data.id,
          branch_ids:this.branch,
          role_id:this.role,
          city:this.register.value.city,
          first_name:this.register.value.firstname,
          last_name:this.register.value.lastname,
          phone:this.register.value.mobile,
          password:this.register.value.Password,
          status:this.action
       }
      }
    }
    else{
      make = {
        url:'addUser',
        data:{
          branch_ids:this.branch,
          role_id:this.role,
          city:this.register.value.city,
          first_name:this.register.value.firstname,
          last_name:this.register.value.lastname,
          phone:this.register.value.mobile,
          password:this.register.value.Password,
          status:this.action      
         }
      }
    }
    
    this.api.postWithoutEmp(make.url, make.data).subscribe(res => {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage', this.navParams.data);
    this.getBranch();
    if(this.navParams.data.id)
    { 
      let branchList = [];
      this.register = this.formBuilder.group({
        firstname: [this.navParams.data.first_name, Validators.required],
        lastname: [this.navParams.data.last_name, Validators.required],
        city: [this.navParams.data.city, Validators.required],
        mobile : [this.navParams.data.phone,Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(10)])],
        Password: [this.navParams.data.originalpass, Validators.required],
        ConfirmPassword: [this.navParams.data.originalpass, Validators.required]
          });
          this.role = this.navParams.data.role_id;
          this.navParams.data.branchinfo.forEach(element => {
            branchList.push(element.branch_id);
          });
          console.log(branchList);
          this.branch = branchList;
          this.action = this.navParams.data.status
    }
  }

}
