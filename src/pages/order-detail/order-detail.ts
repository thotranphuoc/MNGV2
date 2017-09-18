import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
// import { AppService } from '../../services/app.service';
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
  isDisabled: boolean = false;
  data: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private localService: LocalService,
    // private appService: AppService
  ) {
    this.data = this.navParams.data;
    console.log(this.data, this.data.ORDER);
    this.ORDER = this.data.ORDER;
    if(typeof(this.ORDER) !=='undefined'){
      this.SENDER = this.data.SENDER;
      this.SHOP = this.data.SHOP;
    }else{
      this.navCtrl.setRoot('HomePage');
    }
    // this.ORDER = this.navParams.get('ORDER');
    // console.log(this.ORDER);
    // this.SHOP = this.navParams.get('SHOP');
    // console.log(this.SHOP);
    // this.SENDER = this.navParams.get('SENDER');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  setOrderStatus(NEW_STATUS){
    let ORDER: iOrder = this.ORDER;
    let DATE = ORDER.ORDER_DATE_CREATE.substr(0,10);
    this.localService.setNewStatusForOrder(ORDER.ORDER_SHOP_ID, ORDER.ORDER_USER_ID, NEW_STATUS, ORDER.ORDER_ID, DATE);
    this.ORDER.ORDER_STATUS = NEW_STATUS;

    if(NEW_STATUS === 'DELETED'){
      this.navCtrl.pop();
      this.isDisabled = true;
      
    }
  }

  setOrderDeleted(){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Deleted',
          role: 'destructive',
          handler: () => {
            this.setOrderStatus('DELETED');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  editOrder(){
    console.log('admin click to edit order');
    this.navCtrl.push('Shop2Page', { SHOP: this.SHOP, ORDER: this.ORDER, USER_ID: this.ORDER.ORDER_USER_ID });
  }

}
