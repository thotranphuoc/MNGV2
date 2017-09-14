import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { iShop } from '../../interfaces/shop.interface';
import { iItem } from '../../interfaces/item.interface';
import { iProfile } from '../../interfaces/profile.interface';

@IonicPage()
@Component({
  selector: 'page-update-items',
  templateUrl: 'update-items.html',
})
export class UpdateItemsPage {
  data: any;
  SHOP: iShop = null;
  PROFILE: iProfile;
  SHOP_ITEMS: iItem[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,

    private localService: LocalService
  ) {
    this.data = this.navParams.data;
    this.SHOP = this.data.SHOP;
    this.PROFILE = this.data.PROFILE;
    if (typeof (this.SHOP) == 'undefined') {
      this.SHOP = null
      this.navCtrl.setRoot('HomePage');
    }
    if(this.SHOP){
      this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.SHOP.SHOP_ID)
      .then((res: any)=>{
        console.log(res);
        this.SHOP_ITEMS = res.SHOP_ITEMS;
      })
      .catch((err)=>{
        console.log(err);
        this.SHOP_ITEMS = [];
      });
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateItemsPage');
  }

  selectITEM(item, i){
    console.log(item, i);
    this.navCtrl.push('UpdateItemPage', {SHOP_ITEM: item});
  }

}
