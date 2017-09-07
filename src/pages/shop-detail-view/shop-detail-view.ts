import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';
import { AppService } from '../../services/app.service';

@IonicPage()
@Component({
  selector: 'page-shop-detail-view',
  templateUrl: 'shop-detail-view.html',
})
export class ShopDetailViewPage {
  data: any;
  SHOP: iShop = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private appService: AppService
  ) {
    this.data = this.navParams.data;
    this.SHOP = this.data.SHOP;
    console.log(this.data);
    if(typeof(this.SHOP) === 'undefined'){
      this.SHOP = null;
      this.navCtrl.setRoot('HomePage');
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopDetailViewPage');
  }

  onClick(){
    this.appService.toastMsg('This function will be available soon. Thanks', 5000);
  }


}
