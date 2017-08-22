import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { iItem } from '../../interfaces/item.interface';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  countryList: any[] = [];
  itemList: iItem[] = [];
  itemListObservable: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afDB: AngularFireDatabase) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

  }

  getItems(event) {
    console.log(event.srcElement.value);
    let srcStr = null;
    if (typeof (event.srcElement.value) != 'undefined') {
      let srcStr = event.srcElement.value.trim();
      if (srcStr) {
        this.searchString(srcStr);
      } else {
        console.log('no string')
        this.itemList = [];
      }
    }else{
      this.itemList = [];
    }
  }

  searchString(searchStr: string) {
    this.itemList = [];
    this.afDB.list('Items/').forEach((items: iItem[]) => {
      this.itemList = items.filter(item => item.ITEM_NAME_EN.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase()) >= 0 || item.ITEM_NAME_LOCAL.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase()) >= 0)
    })
  }

  getItems2(event) {
    console.log(event.srcElement.value);
    let srcStr = null;
    if (typeof (event.srcElement.value) != 'undefined') {
      let srcStr = event.srcElement.value.trim();
      if (srcStr) {
        this.searchString2(srcStr);
      } else {
        console.log('no string')
        this.itemList = [];
      }
    }else{
      this.itemList = [];
    }
  }

  searchString2(searchStr: string){
    this.itemListObservable = this.afDB.list('Items',{
      query: {
        orderByChild: 'ITEM_NAME_EN',
        equalTo: searchStr
      }
    })
  }

  go2Shop(item: iItem) {
    console.log(item);
    this.afDB.object('Shops/' + item.ITEM_SHOP_ID).forEach((shop) => {
      console.log(shop);
      this.navCtrl.push('ShopPage', {shop: shop});
    })
  }

}
