import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams,
  // ModalController 
} from 'ionic-angular';

// import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
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
  PROFILE_OLD: any;
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
  // USER_ID: string = null;
  // USER_EMAIL: string = null;
  action: string = 'edited-by-owner';
  btnEnable: boolean = true;
  base64Images: string[] = [];
  hasNewAvatar: boolean = false;
  data: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private modalCtrl: ModalController,
    // private afService: AngularFireService,
    private dbService: DbService,
    private appService: AppService,
    private imageService: ImageService,
    private localService: LocalService) {
    this.PROFILE = this.localService.PROFILE;
    this.data = this.navParams.data;
    console.log(this.data);
    // let act = this.navParams.get('action');
    let act = this.data.action;
    if (typeof (act) != 'undefined') {
      this.action = act;
    } else {
      this.navCtrl.setRoot('HomePage');
    }

    // user update by their own;
    if (this.action === 'edited-by-owner') {
      // this.USER = this.afService.getAuth().auth.currentUser;
      this.USER = this.data.USER;
      if (this.USER != null) {
        // this.USER_ID = this.USER.uid;
        // this.USER_EMAIL = this.USER.email;
        this.getProfile(this.USER.uid);
        this.PROFILE.PROFILE_EMAIL = this.USER.email;
      }
    } else {
      // edited by admin
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getProfile(USER_ID: string) {
    console.log(USER_ID);
    this.dbService.getOneItemReturnPromise('UserProfiles/' + USER_ID)
      .then((res: iProfile) => {
        console.log(res);
        if (res != null) {
          this.localService.PROFILE_OLD = res;
          this.PROFILE = res
          this.base64Images[0] = this.PROFILE.PROFILE_AVATAR_URL;
        } else {
          console.log('User does not update profile yet');
        }
      })
      .catch((err) => { console.log(err) })
  }

  onUpdateProfile(form) {
    if (this.USER.uid) {
      if (this.hasNewAvatar) {
        this.uploadImages(this.base64Images)
          .then((res: string[]) => {
            this.PROFILE.PROFILE_AVATAR_URL = res[0];
            console.log(this.PROFILE);
            this.dbService.insertAnObjectAtNode('UserProfiles/' + this.USER.uid, this.PROFILE)
              .then((res) => {
                console.log(res);
                this.resetDefault();
                this.appService.toastMsg('Successfully changed', 3000);
                this.navCtrl.pop();
              })
              .catch((err) => { console.log(err) })
          })
          .catch((err) => { console.log(err) })
      } else {
        console.log(this.PROFILE);
        this.dbService.insertAnObjectAtNode('UserProfiles/' + this.USER.uid, this.PROFILE)
          .then((res) => {
            console.log(res);
            this.resetDefault();
            this.navCtrl.pop();
            this.appService.toastMsg('Successfully changed', 3000);
          })
          .catch((err) => { console.log(err) })
      }
    } else {
      console.log('User not logged in');
      this.appService.toastMsg('User not logged in', 3000);
    }
  }

  selectPhotoByBrowser() {
    console.log('select photo')
    document.getElementById('inputFile').click();
  }

  takePictureAndResizeByBrowser(event) {
    this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          this.base64Images = imgDataUrls
          this.hasNewAvatar = true;
        }, 2000)
      })
      .catch((err) => { console.log(err) })
  }

  uploadImages(images: string[]) {
    let URL = 'Avatar/' + this.USER.uid;
    let NAME = this.USER.uid;
    return this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL(URL, images, NAME);
  }

  resetDefault() {
    this.hasNewAvatar = false;
    this.localService.PROFILE = this.localService.PROFILE_DEFAULT;
  }
}
