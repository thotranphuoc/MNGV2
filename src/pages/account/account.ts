import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { CrudService } from '../../services/crud.service';
@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  data: any;
  action: string = 'sign-in';
  signIn: { email: string, password: string } = { email: '', password: '' };
  signUp: { email: string, password1: string, password2: string } = { email: '', password1: '', password2: '' };
  resetAccount: { email: string } = { email: '' };
  isBackable: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private authService: AuthService,
    private crudService: CrudService,
    private appService: AppService) {
    this.data = navParams.data;
    this.action = this.data.action;
    if (typeof (this.action) != 'undefined') {
      this.isBackable = true;
    } else {
      this.navCtrl.setRoot('HomePage');
    }
    console.log(this.action);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  onSignIn(form) {
    console.log(form.value);
    this.authService.signIn(this.signIn.email, this.signIn.password)
      .then(() => {
        console.log('Login success');
        this.navCtrl.setRoot('HomePage');
      })
      .catch((err) => {
        console.log('Error when loggin');
        this.appService.alertError('Error', err.message)
      })
  }

  onSignInOnRequest(form) {
    console.log(form.value);
    this.authService.signIn(this.signIn.email, this.signIn.password)
      .then(() => {
        console.log('Login success');
        this.navCtrl.pop();
      })
      .catch((err) => {
        console.log('Error when loggin');
        this.appService.alertError('Error', err.message)
      })
  }

  onSignUp(form) {
    console.log(form.value);
    if (this.signUp.password1 === this.signUp.password2) {
      this.crudService.accountSignUp(this.signUp.email, this.signUp.password1)
        .then((res) => {
          console.log(res);
          this.appService.alertMsg('Success', 'Account created successfully. Please sign in');
          this.navCtrl.pop();
        })
        .catch((err) => {
          console.log(err);
          this.appService.alertMsg('Fail', 'message:' + err.message);
        })
    } else {
      this.appService.alertMsg('Fail', 'password not matched')
    }
  }

  onResetAccount(form) {
    // this.btnReset = false;
    console.log(form.value)
    this.authService.resetAccount(this.resetAccount.email)
      .then((data) => {
        // this.btnReset = true;
        this.authService.isSigned = false;
        // this.isSigned = this.authService.isSigned;
        this.appService.alertMsg('Success', 'Please check email and reset your account: ' + this.resetAccount.email);
        this.navCtrl.push('HomePage');
      })
      .catch((err) => {
        console.log('Wrong email');
        this.appService.alertMsg('Fail', this.resetAccount.email+' not registered yet');
      })
  }

  go2SignUp() {
    this.action = 'sign-up';
  }

  go2ResetPassword() {
    this.action = 'reset-account';
  }

  close() {
    // this.viewCtrl.dismiss()
    // .catch((err)=>{
    //   console.log(err);
    // });
    this.navCtrl.pop();
  }



}
