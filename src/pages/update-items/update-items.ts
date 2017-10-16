import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { iShop } from '../../interfaces/shop.interface';
import { iItem } from '../../interfaces/item.interface';
import { iProfile } from '../../interfaces/profile.interface';

@IonicPage()
@Component({
  selector: 'page-update-items',
  templateUrl: 'update-items.html',
})
export class UpdateItemsPage {
  n: number = 1;
  data: any;
  SHOP: iShop = null;
  PROFILE: iProfile;
  SHOP_ITEMS: iItem[];
  isHidden: boolean = false;
  SHOP_ITEM: iItem;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,

    private localService: LocalService
  ) {
    this.data = this.navParams.data;
    console.log(this.data);
    this.SHOP = this.data.SHOP;
    this.PROFILE = this.data.PROFILE;
    if (typeof (this.SHOP) == 'undefined') {
      this.SHOP = null
      this.navCtrl.setRoot('HomePage');
    }
    if(this.SHOP){
      this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.SHOP.SHOP_ID)
      .then((res: any)=>{
        console.log(res);
        this.SHOP_ITEMS = res.SHOP_ITEMS;
        this.SHOP_ITEMS.map(item=> item['isItemUpdate']=false);
        console.log(this.SHOP_ITEMS);
      })
      .catch((err)=>{
        console.log(err);
        this.SHOP_ITEMS = [];
      });
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateItemsPage');
  }

  selectITEM(item, i){
    console.log(item, i);
    this.navCtrl.push('UpdateItemPage', {SHOP: this.SHOP, SHOP_ITEM: item});
  }

  // doHiding(){
  //   this.isHidden = !this.isHidden;
  //   console.log(this.isHidden);
  // }

  updateItem(item, i){
    // // console.log(item);
    // this.SHOP_ITEM = item;
    // this.SHOP_ITEMS.map(item=>item['isItemUpdate']= false);
    // item['isItemUpdate'] = true;
    this.navCtrl.push('UpdateItemPage', {SHOP: this.SHOP, SHOP_ITEM: item});
  }

  doUpdate(){
    let ITEM_NAME_EN = document.getElementById('ITEM_NAME_EN')
    console.log(ITEM_NAME_EN);
  }

  clickToggle(){
    console.log('click toggle');
  }

  doOptions(){
    if(this.n<2){
      console.log(this.n);
      this.n++;
    }else{
      console.log(this.n)
      this.n = 1;
      
    }
  }

  

}
