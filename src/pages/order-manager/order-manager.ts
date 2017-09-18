import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { iOrder } from '../../interfaces/order.interface';
import { iItem } from '../../interfaces/item.interface';
import { iShop } from '../../interfaces/shop.interface';

// import { Subscription } from 'rxjs/Subscription';



@IonicPage()
@Component({
  selector: 'page-order-manager',
  templateUrl: 'order-manager.html',
})
export class OrderManagerPage {
  data: any;
  SHOP: iShop = null;
  SHOP_ID: string = '-KpxM-lgwzEKCrqU0Cp9'
  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  ORDERs_NEW: any[] = [];

  // for unsubcribe
  subscription;
  DATE: any = '2017/07/23';
  selectedDate: string = null;

  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private appService: AppService,
    private afService: AngularFireService,
    private dbService: DbService,
    private localService: LocalService
  ) {
    this.data = this.navParams.data;
    this.SHOP = this.data.SHOP;
    if (typeof (this.SHOP) === 'undefined') {
      this.navCtrl.setRoot('HomePage');
    } else {
      this.SHOP_ID = this.SHOP.SHOP_ID;
    }
    // this.SHOP_ID = this.navParams.get('SHOP_ID');
    
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });

    this.startLoading();
    this.DATE = this.appService.getCurrentDate();
    // get Shop information:
    if (this.localService.SHOP.SHOP_ID != null) {
      this.SHOP = this.localService.SHOP;
      console.log(this.SHOP);
      this.hideLoading()
    } else {
      this.dbService.getOneItemReturnPromise('Shops/' + this.SHOP_ID).then((data: iShop) => {
        this.SHOP = data;
        console.log(this.SHOP);
        this.hideLoading();
      })
    }
    // get SHOP_ITEMS & SHOP_ITEMS_ID
    this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.SHOP_ID)
      .then((data: any) => {
        this.SHOP_ITEMS = data.SHOP_ITEMS;
        this.SHOP_ITEMS_ID = data.SHOP_ITEMS_ID;
        console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID);
        this.getOrderDetailAsync();
      })
      .catch((err) => {
        console.log(err);
      })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')
    this.selectedDate = this.appService.convertDateFormat1(this.DATE);
  }

  go2OrderDetail(order: iOrder, i) {
    console.log(order, i);
    this.navCtrl.push('OrderDetailPage', { ORDER: order, SHOP: this.SHOP, SENDER: 'ADMIN' });
  }


  // VERIFIED: get array of orders detail of show, async
  getOrderDetailAsync() {
    this.ORDERs_NEW = [];
    let SHOP_ID = this.SHOP_ID;
    let DATE = this.DATE;
    let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;

    this.subscription = this.afService.getList(URL).subscribe((ORDERS: any[]) => {
      console.log(ORDERS);
      this.ORDERs_NEW = [];
      ORDERS.forEach((ORDER: iOrder) => {
        let ORDER_LIST_NEW = [];
        let TOTAL_PRICE = 0;
        ORDER.ORDER_LIST.forEach((item: any) => {
          console.log(item);
          let index = this.SHOP_ITEMS_ID.indexOf(item.item);
          console.log(index);
          ORDER_LIST_NEW.push({ item: this.SHOP_ITEMS[index], amount: item.amount });
          let PRICE = item.amount * this.SHOP_ITEMS[index].ITEM_PRICE;
          TOTAL_PRICE += PRICE;
        })
        ORDER['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
        ORDER['TOTAL_PRICE'] = TOTAL_PRICE;
        this.ORDERs_NEW.push(ORDER)
      })
      this.hideLoading();
    })
  }

  ionViewWillLeave() {
    if (typeof (this.subscription) !== 'undefined') {
      this.subscription.unsubscribe();
    } else {

    }
  }

  selectDate() {
    console.log(this.selectedDate);
    if (this.selectedDate != null) {
      this.DATE = this.selectedDate.substr(0, 4) + '/' + this.selectedDate.substr(5, 2) + '/' + this.selectedDate.substr(8, 2);
    } else {
      this.appService.alertMsg('Alert', 'Choose date to show');
    }
    console.log(this.DATE);

    this.getOrderDetailAsync();
  }

  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss().catch((err) => { console.log(err)});
  }



}
