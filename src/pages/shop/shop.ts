import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { iShop } from '../../interfaces/shop.interface';
@IonicPage({
  name: 'shop-page',
  segment: 'shop/:id',
})
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {
  loading: any;
  SHOP: any;
  SHOP_ITEMS: any[] = [];
  SHOP_ITEMS_ID: any[] = [];
  USER_ID: string = null;
  n: number = 2;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private dbService: DbService,
  ) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
    this.startLoading();
    let shopId = this.navParams.get('id');
    console.log('id: ', shopId);
    this.getShop(shopId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss().catch((err) => { console.log(err) });
  }

  getShop(SHOP_ID){
    this.dbService.getOneItemReturnPromise('Shops/'+SHOP_ID)
    .then((SHOP: iShop)=>{
      this.hideLoading();
      this.go2Shop(SHOP);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  go2Shop(shop: iShop) {
    console.log(shop.SHOP_OTHER);
    if('SHOP_OTHER' in shop){
      console.log(shop.SHOP_OTHER);

      // if isVERIFIED exist
      if('isVERIFIED' in shop.SHOP_OTHER){
        if(shop.SHOP_OTHER.isVERIFIED){
          console.log('isVERIFIED TRUE');
          this.navCtrl.setRoot('Shop2Page', { SHOP: shop });
        }else{
          console.log('isVERIFIED FALSE');
          this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
        }
      }else{
        console.log('isVERIFIED not exist');
        this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
      }
    }else{
      console.log('no SHOP_OTHER')
      this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
    }
  }

}
