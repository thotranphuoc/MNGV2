import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-pop-over',
  templateUrl: 'pop-over.html',
})
export class PopOverPage {
  shop: iShop = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private app: App,
    private viewCtrl: ViewController) {
    this.shop = this.navParams.data;
    console.log(this.shop);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOverPage');
  }

  closePopover() {
    this.viewCtrl.dismiss().catch((err) => { console.log(err)});
  }

  go2Shop() {
    // console.log('go to detailed page');
    // this.app.getRootNav().setRoot('ShopPage', {shop: this.shop});
    // this.closePopover();
    // // this.navCtrl.setRoot('ShopPage', this.shop)
    this.go2Shop1(this.shop);
    this.closePopover();

  }

  go2Shop1(shop: iShop) {
    console.log(shop.SHOP_OTHER);
    if('SHOP_OTHER' in shop){
      console.log(shop.SHOP_OTHER);

      // if isVERIFIED exist
      if('isVERIFIED' in shop.SHOP_OTHER){
        if(shop.SHOP_OTHER.isVERIFIED){
          console.log('isVERIFIED TRUE');
          // this.navCtrl.setRoot('ShopPage', { shop: shop });
          this.app.getRootNav().setRoot('Shop2Page', {SHOP: this.shop});
        }else{
          console.log('isVERIFIED FALSE');
          // this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
          this.app.getRootNav().setRoot('Shop1Page', {SHOP: this.shop});
        }
      }else{
        console.log('isVERIFIED not exist');
        // this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
        this.app.getRootNav().setRoot('Shop1Page', {SHOP: this.shop});
      }
    }else{
      console.log('no SHOP_OTHER')
      this.app.getRootNav().setRoot('Shop1Page', {SHOP: this.shop});
    }
  }

}
