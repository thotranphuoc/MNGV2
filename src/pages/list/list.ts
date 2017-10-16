import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ClipboardService } from '../../services/clipboard.service';
import { AppService } from '../../services/app.service';
import { GmapService } from '../../services/gmap.service';
import { LocalService } from '../../services/local.service';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  data: any;
  shop: iShop;
  shopList: any[] = [];
  isBackable: boolean = false;
  USER_LOCATION: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localService: LocalService,
    private gmapService: GmapService,
    private clipboardService: ClipboardService,
    private appService: AppService
  ) {
    this.data = this.navParams.data;
    this.shopList = this.data.shops;
    console.log(this.data);
    console.log(this.shopList);
    if (typeof (this.shopList) !== 'undefined') {
      this.isBackable = true;
      this.addDistanceThenSorted();
    } else {
      this.isBackable = false;
      if(this.localService.SHOPs_NEARBY_DETAIL.length>0){
        console.log(this.localService.SHOPs_NEARBY_DETAIL)
        this.shopList = Array.from(new Set(this.localService.SHOPs_NEARBY_DETAIL));
        this.addDistanceThenSorted();
      }else{
        // this.navCtrl.setRoot('HomePage');
      }
      
    }
  }

  addDistanceThenSorted(){
    this.shopList.forEach((shop: iShop) => {
      shop['distance'] = this.gmapService.getDistanceFromCurrent(shop.SHOP_LOCATION.lat, shop.SHOP_LOCATION.lng);
    })
    console.log(this.shopList);
    this.shopList.sort((a, b) => {
      let ax = a.distance.distance;
      let bx = b.distance.distance;
      return ax - bx;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
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

  go2Map() {
    if (this.isBackable) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('MapPage');
    }
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

  showShopOnMap(SHOP: iShop){
    this.navCtrl.setRoot('MPage', { SHOP: SHOP});
  }

}
