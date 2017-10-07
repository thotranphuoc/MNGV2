import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';
// import { iItem } from '../../interfaces/item.interface';
// import { AngularFireService } from '../../services/af.service';
// import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {
  shop: iShop = null;
  SHOP_ITEMS: any[] = [];
  SHOP_ITEMS_ID: any[] = [];

  tab1Root = 'ShopMenuPage';
  tab2Root = 'ShopOrderPage';
  tab3Root = 'ShopBillPage';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private dbService: DbService,
    private localService: LocalService,
    // private afService: AngularFireService
  ) {
    this.shop = navParams.data.shop;
    console.log(this.shop);
    if (typeof (this.shop) === 'undefined') {
      this.navCtrl.setRoot('HomePage');
    }
    this.localService.SHOP = this.shop;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }
}
