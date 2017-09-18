import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
// import { AppService } from '../../services/app.service';

import { iShop } from '../../interfaces/shop.interface';
import { iProfile } from '../../interfaces/profile.interface';
@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  data: any;
  USER_ID: string = null;
  SHOP_IDs: string[] = [];
  SHOPs: iShop[] = [];
  PROFILE: iProfile = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private afService: AngularFireService,
    // private appService: AppService,
    private dbService: DbService
  ) {
    this.data = this.navParams.data;
    console.log(this.data);
    
    if (typeof (this.data.USER) !== 'undefined') {
      this.USER_ID = this.data.USER.uid;
      this.dbService.getOneItemReturnPromise('UserProfiles/' + this.USER_ID)
        .then((profile: iProfile) => {
          this.PROFILE = profile;
        })
        .catch((err) => { console.log(err); })

      this.dbService.getListReturnPromise_ArrayOfData('Admins/' + this.USER_ID)
        .then((res: any[]) => {
          console.log(res);
          this.SHOP_IDs = res;
          this.SHOPs = [];
          this.SHOP_IDs.forEach(SHOP_ID => {
            this.dbService.getOneItemReturnPromise('Shops/' + SHOP_ID).then((shop: iShop) => {
              this.SHOPs.push(shop);
            })
          })
        })
        .catch((err) => { console.log(err); })
    } else {
      this.navCtrl.setRoot('HomePage');
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