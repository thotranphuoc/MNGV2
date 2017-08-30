import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { GmapService } from '../../services/gmap.service';
import { iShop } from '../../interfaces/shop.interface';
@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  myFavShop_ID: string[] = [];
  myFavoriteShops: any[] = [];
  myFavoriteItems: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private gmapService: GmapService,
    private afAuth: AngularFireAuth,
    private dbService: DbService) {
    let USER_ID = this.afAuth.auth.currentUser.uid
    this.dbService.getListReturnPromise_ArrayOfKey('Favorites/' + USER_ID).then((res: any[]) => {
      console.log(res)
      this.myFavShop_ID = res;
      this.myFavoriteShops = [];
      let n = this.myFavShop_ID.length;
      let i = 0;
      this.myFavShop_ID.forEach(SHOP_ID => {
        this.dbService.getOneItemReturnPromise('Shops/' + SHOP_ID).then((SHOP: iShop) => {
          SHOP['distance'] = this.gmapService.getDistanceFromCurrent(SHOP.SHOP_LOCATION.lat, SHOP.SHOP_LOCATION.lng);
          this.myFavoriteShops.push(SHOP);
          i++;
          if (i = n) {
            this.myFavoriteShops.sort((a, b) => {
              let ax = a.distance.distance;
              let bx = b.distance.distance;
              return ax - bx;
            })
          }
        })
      });
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  go2Shop(shop: iShop) {
    console.log(shop.SHOP_OTHER);
    if('SHOP_OTHER' in shop){
      console.log(shop.SHOP_OTHER);

      // if isVERIFIED exist
      if('isVERIFIED' in shop.SHOP_OTHER){
        if(shop.SHOP_OTHER.isVERIFIED){
          console.log('isVERIFIED TRUE');
          this.navCtrl.setRoot('ShopPage', { shop: shop });
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

}
