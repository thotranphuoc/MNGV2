import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { iShop } from '../../interfaces/shop.interface';
import { iProfile } from '../../interfaces/profile.interface';
@IonicPage()
@Component({
  selector: 'page-admin-board',
  templateUrl: 'admin-board.html',
})
export class AdminBoardPage {
  data: any;
  SHOP: iShop;
  USER_ID: string;
  PROFILE: iProfile;
  USER_ROLE: string = 'staff';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService
  ) {
    this.data = this.navParams.data;
    this.USER_ID = this.data.USER_ID;
    this.SHOP = this.data.SHOP;
    if (typeof (this.SHOP) == 'undefined') {
      this.navCtrl.setRoot('HomePage');
    }
    console.log(this.data.SHOP);
    this.PROFILE = this.data.PROFILE;
    if(this.SHOP){
      this.getRoleOfUserFromShop(this.SHOP.SHOP_ID, this.USER_ID).then((res: any)=>{
        console.log(res);
        this.USER_ROLE = res.ROLE;
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminBoardPage');
  }

  getRoleOfUserFromShop(SHOP_ID, USER_ID){
    return new Promise((resolve, reject)=>{
      this.dbService.getListReturnPromise_ArrayOfData('AdminsOfShop/'+SHOP_ID)
      .then((admins: any[])=>{
        console.log(admins);
        let i = admins.map(admin => admin.UID).indexOf(USER_ID);
        console.log(i);
        if(i<0){
          reject('No ROLE found');
        }else{
          let ROLE = admins[i].ROLE;
          resolve({ROLE: ROLE})
        }
      })
    })
    
  }

  go2OrderManager() {
    this.navCtrl.push('OrderManagerPage', { SHOP_ID: this.SHOP.SHOP_ID });
  }

  go2Statistic() {
    this.navCtrl.push('OrderStatisticPage', { SHOP_ID: this.SHOP.SHOP_ID });
  }

  go2DailyStatistic() {
    this.navCtrl.push('OrderDailyStatisticPage', { SHOP_ID: this.SHOP.SHOP_ID })
  }

  go2RangeStatistic() {
    this.navCtrl.push('OrderRangeStatisticPage', { SHOP_ID: this.SHOP.SHOP_ID });
  }

  go2StaffManager() {
    this.navCtrl.push('StaffManagerPage', this.data);
  }

  go2UpdateShop() {
    console.log('Update Shop information');
    this.navCtrl.push('UpdateShopPage', { SHOP: this.SHOP, USER_ID: this.USER_ID, PROFILE: this.PROFILE });
  }

  go2UpdateItems() {
    console.log('Update Items Information');
    this.navCtrl.push('UpdateItemsPage', { SHOP: this.SHOP, USER_ID: this.USER_ID, PROFILE: this.PROFILE })
  }

}
