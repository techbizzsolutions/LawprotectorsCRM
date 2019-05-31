import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  private register: FormGroup;
  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams) {
    this.register = this.formBuilder.group({
      Password: ["", Validators.required],
      ConfirmPassword: ["", Validators.required]
    });
  }

  logForm()
  {
     this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

}
