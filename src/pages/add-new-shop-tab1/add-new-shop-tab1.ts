import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-add-new-shop-tab1',
  templateUrl: 'add-new-shop-tab1.html',
})
export class AddNewShopTab1Page {
  SHOP: iShop;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService) {
    this.SHOP = this.localService.SHOP;
    console.log(this.SHOP);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopTab1Page');
  }

  ionViewWillLeave(){
    console.log(this.SHOP);
    this.localService.SHOP = this.SHOP;
  }

  ionViewWillEnter(){
    this.SHOP = this.localService.SHOP;
    console.log(this.SHOP);
  }

}
