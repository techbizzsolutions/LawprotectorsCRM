import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-call-info',
  templateUrl: 'call-info.html',
})
export class CallInfoPage {
  private register: FormGroup;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
     public navParams: NavParams) {
    this.register = this.formBuilder.group({
      mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(10)])],
    });
  }

  logForm()
  {
    this.loader.Show("Loading...");
    let user = JSON.parse(localStorage.getItem('user'));
    let url = (user.role =='3')?'serachSpotinfo':'serachCallinfo';
    this.api.postWithoutEmp(url, {
      'phone':this.register.value.mobile
    }).subscribe(res => {
      console.log('addCallStatus', res);
      this.loader.Hide();
      if (res.status) {
        let confirmAlert = this.alertCtrl.create({
          subTitle: "Number is already registered, Do you want to proceed further?",
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
                res.list[0].action= 1;
                if(user.role =='3') {
                  this.navCtrl.setRoot('SpotVisitInfoPage',res.list[0]);
                  }
                  else{
                    this.navCtrl.setRoot('SpotVisitInfoTcPage',res.list[0]);
                  }
              }
            }
          ]
        });
        confirmAlert.present();
      }
      else {
        let data = {
          phone:this.register.value.mobile
        }
        if(user.role =='3') {
          this.navCtrl.setRoot('SpotVisitInfoPage',data);
          }
          else{
            this.navCtrl.setRoot('SpotVisitInfoTcPage',data);
          }
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
    console.log('ionViewDidLoad CallInfoPage');
  }

}
