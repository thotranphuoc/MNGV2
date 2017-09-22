import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireDatabase, 
  // FirebaseListObservable, 
  // FirebaseObjectObservable 
} from 'angularfire2/database';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-search-shop',
  templateUrl: 'search-shop.html',
})
export class SearchShopPage {
  shopList: iShop[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private afDB: AngularFireDatabase
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchShopPage');
  }

  close(){
    this.viewCtrl.dismiss()
    .catch((err)=>{
      console.log(err);
    })
  }

  getShops(event){
    console.log(event.srcElement.value);
    if (typeof (event.srcElement.value) != 'undefined') {
      let srcStr = event.srcElement.value.trim();
      if (srcStr) {
        this.searchString(srcStr);
      } else {
        console.log('no string')
        this.shopList = [];
      }
    }else{
      this.shopList = [];
    }
  }
  
  searchString(searchStr: string) {
    this.shopList = [];
    this.afDB.list('Shops/').forEach((shops: iShop[]) => {
      this.shopList = shops.filter(shop => shop.SHOP_NAME.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase()) >= 0);
      console.log(this.shopList);
    })
    .then(()=>{
      console.log(this.shopList);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  go2Shop(shop: iShop) {
    this.viewCtrl.dismiss({SHOP: shop})
    .catch((err)=>{
      console.log(err);
    })
  }

}
