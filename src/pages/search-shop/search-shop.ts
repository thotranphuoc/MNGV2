import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireDatabase, 
  // FirebaseListObservable, 
  // FirebaseObjectObservable 
} from 'angularfire2/database';
import { ClipboardService } from '../../services/clipboard.service';
import { AppService } from '../../services/app.service';
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
    private afDB: AngularFireDatabase,
    private clipboardService: ClipboardService,
    private appService: AppService
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

  go2ShopDetailView(shop){
    console.log('go2ShopDetailView', shop);
    this.navCtrl.push('ShopDetailViewPage', { SHOP: shop});
  }
  
  //click and paste shareable url
  shareShop(SHOP: iShop){
    let copiedString = 'menu2book.com/#/mapx/'+SHOP.SHOP_ID;
    console.log(copiedString);
    this.clipboardService.copy(copiedString)
    .then((res)=>{
      console.log(res);
      // alert(copiedString + ' copied');
      this.appService.toastMsgWithPosition('Copied !', 3000, 'middle');
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  shareShopOnMap(SHOP){
    let copiedString = 'menu2book.com/#/shop/'+SHOP.SHOP_ID;
    this.viewCtrl.dismiss({SHOP: SHOP, copiedStr: copiedString, PAGE: 'MPage' })
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

}
