import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';

import { iItem } from '../../interfaces/item.interface';
import { iOrder } from '../../interfaces/order.interface';
import { iShop } from '../../interfaces/shop.interface';
import { iOrderList } from '../../interfaces/order-list.interface';
@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  DATE: any = '2017/07/23';
  selectedDate: string = null;
  SHOPs: iShop[] = [];
  USER_ID: string;
  SHOPS_ITEMS: iItem[] = [];
  SHOPS_ITEMS_ID: any[] = [];
  SHOPS_ORDERS: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private localService: LocalService,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService
  ) {
    this.DATE = this.appService.getCurrentDate();
    // 1. get and set current date as default date
    this.selectedDate = this.appService.convertDateFormat1(this.DATE);
    this.USER_ID = this.localService.USER_ID;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YourOrdersPage');
  }

  ionViewWillEnter() {
    this.selectedDate = this.appService.convertDateFormat1(this.DATE);
    setTimeout(() => {
      this.getUserID();
    }, 1000);
  }


  getUserID() {
    console.log(this.USER_ID);
    if (this.USER_ID == null) {
      if (this.afService.getAuth().auth.currentUser) {
        this.USER_ID = this.afService.getAuth().auth.currentUser.uid;
      } else {
        this.showConfirm();
      }
      this.DATE = this.appService.getCurrentDate();
      this.initGetYourOrder();
    }
  }

  initGetYourOrder() {
    console.log(this.USER_ID, this.DATE);
    this.localService.getSHOPs_ID(this.USER_ID, this.DATE)
      .then((shop_id_list: string[]) => {
        console.log(shop_id_list);
        if (shop_id_list.length > 0) {
          this.SHOPS_ITEMS = [];
          this.SHOPS_ITEMS_ID = [];
          shop_id_list.forEach(shop_id => {
            this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(shop_id).then((data: any) => {
              console.log(data);
              this.SHOPS_ITEMS = this.SHOPS_ITEMS.concat(data.SHOP_ITEMS);
              this.SHOPS_ITEMS_ID = this.SHOPS_ITEMS_ID.concat(data.SHOP_ITEMS_ID);
            })
              .then(() => {
                console.log(this.SHOPS_ITEMS);
                console.log(this.SHOPS_ITEMS_ID);
              })
              .then(() => {
                this.getOrderDetail();
              })

            this.SHOPs = [];
            this.dbService.getOneItemReturnPromise('Shops/' + shop_id).then((shop: iShop) => {
              this.SHOPs.push(shop);
            })
          });
          console.log(this.SHOPs);
          console.log(this.SHOPS_ITEMS, this.SHOPS_ITEMS_ID);
        } else {
          this.SHOPS_ORDERS = [];
        }
      })
      .catch((err)=>{
        console.log(err);
        this.SHOPS_ORDERS = [];
      })
  }

  getOrderDetail() {
    console.log('Done init');
    // 1. Get array of order_url of user on one date
    this.localService.getORDERS_IDOfUser(this.USER_ID, this.DATE).then((ORDER_URLs: any[]) => {
      console.log('Orders Url', ORDER_URLs);
      this.SHOPS_ORDERS = [];
      ORDER_URLs.forEach(ORDER_URL => {
        // 2. From order_url, get detail of order
        this.dbService.getOneItemReturnPromise(ORDER_URL).then((ORDER_DETAIL: iOrder) => {
          console.log('Order detail:', ORDER_DETAIL);
          let ORDER_LIST_NEW = [];
          let TOTAL_PRICE = 0;
          // 3. From each ORDER.ORDER_LIST, get additional to 'ORDER_LIST_NEW' and TOTAL_PRICE
          ORDER_DETAIL.ORDER_LIST.forEach((orderList: iOrderList) => {
            let index = this.SHOPS_ITEMS_ID.indexOf(orderList.item);
            ORDER_LIST_NEW.push({ item: this.SHOPS_ITEMS[index], amount: orderList.amount });
            let PRICE = orderList.amount * this.SHOPS_ITEMS[index].ITEM_PRICE;
            TOTAL_PRICE += PRICE;
          })
          ORDER_DETAIL['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
          ORDER_DETAIL['TOTAL_PRICE'] = TOTAL_PRICE;
          this.SHOPS_ORDERS.push(ORDER_DETAIL);
        })
      });
      console.log('SHOPS_ORDERS:', this.SHOPS_ORDERS);
    })
  }


  go2OrderDetail(order: iOrder, i) {
    console.log(order, i);
    console.log(this.SHOPs);
    let res = null;
    this.SHOPs.forEach((SHOP) => {
      if (SHOP.SHOP_ID === order.ORDER_SHOP_ID) {
        res = SHOP
      }
    })
    console.log(res);
    this.navCtrl.push('OrderDetailPage', { ORDER: order, SHOP: res, SENDER: 'USER' });
  }

  selectDate() {
    console.log(this.selectedDate);
    if (this.selectedDate != null) {
      this.DATE = this.selectedDate.substr(0, 4) + '/' + this.selectedDate.substr(5, 2) + '/' + this.selectedDate.substr(8, 2);
    } else {
      this.appService.alertMsg('Alert', 'Choose date to show');
    }
    console.log(this.DATE);
    this.initGetYourOrder();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Alert!',
      message: 'Please login to use this feature',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.push('AccountPage', { action: 'request-login' });
          }
        }
      ]
    });
    confirm.present();
  }
}
