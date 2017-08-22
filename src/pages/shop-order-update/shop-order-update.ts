import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ShopOrderUpdatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shop-order-update',
  templateUrl: 'shop-order-update.html',
})
export class ShopOrderUpdatePage {
  order: any;
  order_new; any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.order_new = this.navParams.data;
    console.log(this.order_new);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopOrderUpdatePage');
  }

}
