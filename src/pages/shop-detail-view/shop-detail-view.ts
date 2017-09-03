import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-shop-detail-view',
  templateUrl: 'shop-detail-view.html',
})
export class ShopDetailViewPage {
  data: any;
  SHOP: iShop = null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.data;
    this.SHOP = this.data.SHOP;
    console.log(this.data);
    if(typeof(this.SHOP) === 'undefined'){
      this.SHOP = null;
      this.navCtrl.setRoot('HomePage');
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopDetailViewPage');
  }

}
