import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';

import { iShop } from '../../interfaces/shop.interface';
import { iProfile } from '../../interfaces/profile.interface';
@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  USER_ID: string = null;
  SHOP_IDs: string[] = [];
  SHOPs: iShop[] = [];
  PROFILE: iProfile = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afService: AngularFireService,
    private appService: AppService,
    private dbService: DbService
  ) {

    if (this.afService.getAuth().auth.currentUser != null) {
      this.USER_ID = this.afService.getAuth().auth.currentUser.uid;
      console.log(this.USER_ID);
      this.dbService.getOneItemReturnPromise('UserProfiles/' + this.USER_ID).then((profile: iProfile) => {
        this.PROFILE = profile;
      })
      this.dbService.getListReturnPromise_ArrayOfData('Admins/' + this.USER_ID).then((res: any[]) => {
        console.log(res);
        this.SHOP_IDs = res;
        this.SHOPs = [];
        this.SHOP_IDs.forEach(SHOP_ID => {
          this.dbService.getOneItemReturnPromise('Shops/' + SHOP_ID).then((shop: iShop) => {
            this.SHOPs.push(shop);
          })
        })
      })
    }else{
      this.navCtrl.setRoot('HomePage');
      this.appService.alertMsg('Notice:', 'Login to use this function');
      
    }

  }

  go2ShopBoard(SHOP: iShop) {
    console.log(SHOP);
    let data = {
      SHOP: SHOP,
      USER_ID: this.USER_ID,
      PROFILE: this.PROFILE
    }
    this.navCtrl.push('AdminBoardPage', data)
  }
}