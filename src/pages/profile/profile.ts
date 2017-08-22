import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
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
  USER_ID: string = null;
  USER_EMAIL: string = null;
  action: string = 'edited-by-owner';
  btnEnable: boolean = true;
  base64Images: string[] = null;
  hasNewAvatar: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afService: AngularFireService,
    private dbService: DbService,
    private appService: AppService,
    private imageService: ImageService,
    private localService: LocalService) {
    this.PROFILE = this.localService.PROFILE;
    let act = this.navParams.get('action');
    if (typeof (act) != 'undefined') {
      this.action = act;
    }

    // user update by their own;
    if (this.action === 'edited-by-owner') {
      this.USER = this.afService.getAuth().auth.currentUser;
      if (this.USER != null) {
        this.USER_ID = this.USER.uid;
        this.USER_EMAIL = this.USER.email;
        this.getProfile(this.USER_ID);
        this.PROFILE.PROFILE_EMAIL = this.USER_EMAIL;
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
    this.dbService.getOneItemReturnPromise('UserProfiles/' + USER_ID).then((res: iProfile) => {
      console.log(res);
      if (res != null) {
        this.localService.PROFILE_OLD = res;
        this.PROFILE = res
        // this.base64Images[0] = this.PROFILE.AVATAR_URL;
      } else {
        console.log('User does not update profile yet');
      }
    })
  }

  onUpdateProfile(form) {
    if (this.USER_ID) {
      if (this.hasNewAvatar) {
        this.uploadImages(this.base64Images).then((res: string[]) => {
          this.PROFILE.PROFILE_AVATAR_URL = res[0];
          console.log(this.PROFILE);
          this.dbService.insertAnObjectAtNode('UserProfiles/' + this.USER_ID, this.PROFILE).then((res) => {
            console.log(res);
            this.resetDefault();
          })
        })
      } else {
        console.log(this.PROFILE);
        this.dbService.insertAnObjectAtNode('UserProfiles/' + this.USER_ID, this.PROFILE).then((res) => {
          console.log(res);
          this.resetDefault();
          this.appService.toastMsg('Successfully changed', 3000);
        })
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
  }

  uploadImages(images: string[]) {
    let URL = 'Avatar/' + this.USER_ID;
    let NAME = this.USER_ID;
    return this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL(URL, images, NAME);
  }

  resetDefault() {
    this.hasNewAvatar = false;
    this.localService.PROFILE = this.localService.PROFILE_DEFAULT;
  }

}
