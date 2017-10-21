import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams,
  ModalController
} from 'ionic-angular';

// import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { CrudService } from '../../services/crud.service';
import { AppService } from '../../services/app.service';
import { ImageService } from '../../services/image.service';
import { LocalService } from '../../services/local.service';
import { iProfile } from '../../interfaces/profile.interface';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  // PROFILE_OLD: any;
  PROFILE: iProfile = {
    PROFILE_AVATAR_URL: '',
    PROFILE_NAME: '',
    PROFILE_EMAIL: '',
    PROFILE_BIRTHDAY: '',
    PROFILE_TEL: '',
    PROFILE_ADDRESS: '',
    PROFILE_STATE: '',
    PROFILE_VERIFIED: false,
    PROFILE_UID: '',
    PROFILE_PROVIDER: '',
    PROFILE_IDENTIFIER: '',
    PROFILE_CREATED: '',
    PROFILE_OTHERS: null
  }
  USER: any;
  action: string = 'edited-by-owner';
  base64Images: string[] = [];
  hasNewAvatar: boolean = false;
  data: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private dbService: DbService,
    private crudService: CrudService,
    private appService: AppService,
    private imageService: ImageService,
    private localService: LocalService) {
    this.data = this.navParams.data;
    console.log(this.data);
    if (typeof (this.data.action) != 'undefined') {
      this.action = this.data.action;
      this.USER = this.data.USER;
      this.dbService.getOneItemReturnPromise('UserProfiles/' + this.USER.uid)
        .then((res: iProfile) => {
          console.log(res);
          if (res) {
            this.PROFILE = res;
          } else {
            console.log('Profile not exist');
          }
        })
        .catch((err) => { console.log(err) });
    } else {
      this.navCtrl.setRoot('HomePage');
    }

    // user update by their own;
    if (this.action === 'edited-by-owner') {

    } else {
      // edited by admin
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  onUpdateProfile(form) {
    console.log(this.PROFILE);
    this.PROFILE.PROFILE_UID = this.USER.uid;
    this.PROFILE.PROFILE_CREATED = this.appService.getCurrentDate();
    this.PROFILE.PROFILE_IDENTIFIER = 'email';

    if (this.PROFILE.PROFILE_UID) {
      this.crudService.createProfile(this.PROFILE)
        .then((res) => {
          console.log(res);
          this.appService.toastMsg('Successfully changed', 3000);
          if (this.hasNewAvatar) {
            this.uploadImageThenUpdateURL();
          }
          this.navCtrl.pop();
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      console.log('UID empty');
    }
  }

  takePhoto() {
    console.log('take Photo');
    let photosModal = this.modalCtrl.create('PhotoTakePage', { PHOTOS: this.base64Images });
    photosModal.onDidDismiss((data) => {
      console.log(data);
      this.base64Images = data.PHOTOS;
      this.hasNewAvatar = true;
    });
    photosModal.present()
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) })
  }

  uploadImageThenUpdateURL() {
    console.log(this.PROFILE);
    this.dbService.uploadBase64Image2FBReturnPromiseWithURL('Avatar/' + this.PROFILE.PROFILE_UID, this.base64Images[0], this.PROFILE.PROFILE_UID)
      .then((downloadURL: string) => {
        this.PROFILE.PROFILE_AVATAR_URL = downloadURL;
        console.log(this.PROFILE);
        this.dbService.updateAnObjectAtNode('UserProfiles/' + this.PROFILE.PROFILE_UID, this.PROFILE)
          .then((res) => { console.log(res); })
          .catch((err) => { console.log(err); });
      })
      .catch((err) => console.log(err));
  }
}
