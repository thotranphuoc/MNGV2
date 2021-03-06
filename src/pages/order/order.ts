import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
import { DbService } from '../../services/db.service';

import { iShop } from '../../interfaces/shop.interface';
@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  USER_ID: string;
  SHOPS: iShop[] = [];
  data: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private afDB: AngularFireDatabase,
    // private afAuth: AngularFireAuth,
    private dbService: DbService,
  ) {
    this.data = this.navParams.data;
    console.log(this.data);
    if (typeof (this.data.USER) !== 'undefined') {
      this.USER_ID = this.data.USER.uid;
      this.dbService.getListReturnPromise_ArrayOfKey('ActiveOrdersOfUser/' + this.USER_ID)
        .then((SHOPs_ID: any[]) => {
          console.log(SHOPs_ID)
          this.SHOPS = [];
          SHOPs_ID.forEach(SHOP_ID => {
            this.dbService.getOneItemReturnPromise('Shops/' + SHOP_ID).then((SHOP: iShop) => {
              this.SHOPS.push(SHOP);
            })
          })
        })
        .catch(err => { console.log(err); })
    } else {
      this.navCtrl.setRoot('HomePage');
    }



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  go2Shop(shop: iShop) {
    console.log(shop.SHOP_OTHER);
    if ('SHOP_OTHER' in shop) {
      console.log(shop.SHOP_OTHER);

      // if isVERIFIED exist
      if ('isVERIFIED' in shop.SHOP_OTHER) {
        if (shop.SHOP_OTHER.isVERIFIED) {
          console.log('isVERIFIED TRUE');
          this.navCtrl.setRoot('Shop2Page', { SHOP: shop });
        } else {
          console.log('isVERIFIED FALSE');
          this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
        }
      } else {
        console.log('isVERIFIED not exist');
        this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
      }
    } else {
      console.log('no SHOP_OTHER')
      this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
    }
  }

}
