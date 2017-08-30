import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { GmapService } from '../../services/gmap.service';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  shop: iShop;
  shopList: any[] = [];
  isBackable: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private gmapService: GmapService,
    private afService: AngularFireService) {
    this.shopList = this.navParams.get('shops');
    if (typeof (this.shopList) != 'undefined') {
      this.isBackable = true;
      this.shopList.forEach((shop: iShop) => {
        shop['distance'] = this.gmapService.getDistanceFromCurrent(shop.SHOP_LOCATION.lat, shop.SHOP_LOCATION.lng);
      })
      console.log(this.shopList);
      this.shopList.sort((a, b) => {
        let ax = a.distance.distance;
        let bx = b.distance.distance;
        return ax - bx;
      })
    } else {
      this.isBackable = false;
      this.shopList = [];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  go2Shop(shop: iShop) {
    console.log(shop.SHOP_OTHER);
    // if('SHOP_OTHER' in shop){
    //   console.log(shop.SHOP_OTHER);

    //   // if isVERIFIED exist
    //   if('isVERIFIED' in shop.SHOP_OTHER){
    //     if(shop.SHOP_OTHER.isVERIFIED){
    //       console.log('isVERIFIED TRUE');
    //       this.navCtrl.setRoot('ShopPage', { shop: shop });
    //     }else{
    //       console.log('isVERIFIED FALSE');
    //       this.navCtrl.setRoot('Shop1Page', { shop: shop });
    //     }
    //   }else{
    //     console.log('isVERIFIED not exist');
    //     this.navCtrl.setRoot('Shop1Page', { shop: shop });
    //   }
    // }else{
    //   console.log('no SHOP_OTHER')
    //   this.navCtrl.setRoot('Shop1Page', { shop: shop });
    // }

    if('SHOP_OTHER' in shop){
      console.log(shop.SHOP_OTHER);

      // if isVERIFIED exist
      if('isVERIFIED' in shop.SHOP_OTHER){
        if(shop.SHOP_OTHER.isVERIFIED){
          console.log('isVERIFIED TRUE');
          this.navCtrl.setRoot('Shop2Page', { shop: shop });
        }else{
          console.log('isVERIFIED FALSE');
          this.navCtrl.setRoot('Shop1Page', { shop: shop });
        }
      }else{
        console.log('isVERIFIED not exist');
        this.navCtrl.setRoot('Shop1Page', { shop: shop });
      }
    }else{
      console.log('no SHOP_OTHER')
      this.navCtrl.setRoot('Shop1Page', { shop: shop });
    }
  }

  go2Map() {
    if (this.isBackable) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('MapPage');
    }
  }

}
