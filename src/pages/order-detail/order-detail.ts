import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AppService } from '../../services/app.service';
import { iOrder } from '../../interfaces/order.interface';
@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  ORDER: any;
  SHOP: any;
  SENDER: string = 'USER';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService,
    private appService: AppService
  ) {

    this.ORDER = this.navParams.get('ORDER');
    console.log(this.ORDER);
    this.SHOP = this.navParams.get('SHOP');
    console.log(this.SHOP);
    this.SENDER = this.navParams.get('SENDER');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  setOrderStatus(NEW_STATUS){
    let ORDER: iOrder = this.ORDER;
    let DATE = ORDER.ORDER_DATE_CREATE.substr(0,10);
    this.localService.setNewStatusForOrder(ORDER.ORDER_SHOP_ID, ORDER.ORDER_USER_ID, NEW_STATUS, ORDER.ORDER_ID, DATE);
    this.ORDER.ORDER_STATUS = NEW_STATUS;
  }

}
