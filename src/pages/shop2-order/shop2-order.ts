import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { CrudService } from '../../services/crud.service';

import { iItem } from '../../interfaces/item.interface';
import { iOrderList } from '../../interfaces/order-list.interface';
import { iOrder } from '../../interfaces/order.interface';
@IonicPage()
@Component({
  selector: 'page-shop2-order',
  templateUrl: 'shop2-order.html',
})
export class Shop2OrderPage {
  ORDER: iOrder;
  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  SHOP_ITEMS_INDEX: any[] = [];
  isOrderNEW: boolean = true;
  isOrderUPDATE: boolean = false;
  data: any;
  ACTION: string = null;
  TOTAL: number = 0;
  COUNT: number = 0;
  AsyncOrder: any = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private crudService: CrudService,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService
  ) {
    this.data = this.navParams.data;
    this.SHOP_ITEMS = this.data.SHOP_ITEMS
    this.SHOP_ITEMS_ID = this.data.SHOP_ITEMS_ID;
    this.SHOP_ITEMS_INDEX = this.data.SHOP_ITEMS_INDEX;
    this.isOrderNEW = this.data.isOrderNEW;
    this.isOrderUPDATE = this.data.isOrderUPDATE;
    this.ORDER = this.data.ORDER;
    this.ACTION = this.data.ACTION;
    this.COUNT = this.data.COUNT;
    console.log(this.data);
    this.calTotal();
    this.syncOrderStatus()
  }

  calTotal(){
    this.TOTAL = 0;
    this.SHOP_ITEMS.forEach((element, index) => {
      this.TOTAL += element.ITEM_PRICE*this.SHOP_ITEMS_INDEX[index].count
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Shop2OrderPage');
  }

  subtract(i: number) {
    this.COUNT--;
    if (this.SHOP_ITEMS_INDEX[i]) {
      this.SHOP_ITEMS_INDEX[i].count--;
    }
    // this.checkItemNEWorUPDATE()
    this.checkOrderIfUpdated();
  }

  add(i: number) {
    this.COUNT++
    // this.itemIndex[i].count++;
    this.SHOP_ITEMS_INDEX[i].count++;
    // this.checkItemNEWorUPDATE();

    this.checkOrderIfUpdated();
  }

  sendORDER() {
    let ORDER_LIST: iOrderList[] = [];
    this.SHOP_ITEMS_INDEX.forEach((element, index: number, array) => {
      if (element.count > 0) {
        ORDER_LIST.push({ item: this.SHOP_ITEMS[index].ITEM_ID, amount: element.count });
      }
    });
    console.log(ORDER_LIST);
    let SHOP_ID = this.SHOP_ITEMS[0].ITEM_SHOP_ID;
    let USER_ID = this.afService.getAuth().auth.currentUser != null ? this.afService.getAuth().auth.currentUser.uid : null;
    let DATETIME = this.appService.getCurrentDataAndTime();
    let TABLE = 'T01';
    this.ORDER = {
      ORDER_ID: null,
      ORDER_SHOP_ID: SHOP_ID,
      ORDER_USER_ID: USER_ID,
      ORDER_STAFT_ID: USER_ID,
      ORDER_STATUS: 'SENDING',
      ORDER_DATE_CREATE: DATETIME,
      ORDER_DATE_CLOSE: null,
      ORDER_TABLE: TABLE,
      ORDER_LIST: ORDER_LIST,
    };
    let DATE = this.appService.getCurrentDate();
    if (USER_ID) {
      this.crudService.createOrder(this.ORDER, SHOP_ID, USER_ID, DATE)
        .then((res: any) => {
          console.log(res);
          this.isOrderNEW = false;
          this.closeModal();
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      alert('Please sign in to continue');
      this.navCtrl.push('AccountPage', { action: 'request-login' });
    }
  }

  updateOrder(){
    let ORDER_LIST: iOrderList[] = [];
    this.SHOP_ITEMS_INDEX.forEach((element, index: number, array) => {
      if (element.count > 0) {
        ORDER_LIST.push({ item: this.SHOP_ITEMS[index].ITEM_ID, amount: element.count });
      }
    });
    console.log(ORDER_LIST);
    // this.dbService.getOneItemReturnPromise()
    this.crudService.updateOrder(ORDER_LIST, this.ORDER).then((res)=>{
      console.log(res);
      this.isOrderUPDATE = false;
      this.closeModal();
    }).catch((err)=>{
      console.log(err);
    })
  }

  closeModal() {
    // this.viewCtrl.dismiss();
    let data = {
      SHOP_ITEMS: this.SHOP_ITEMS,
      SHOP_ITEMS_ID: this.SHOP_ITEMS_ID,
      SHOP_ITEMS_INDEX: this.SHOP_ITEMS_INDEX,
      isOrderNEW: this.isOrderNEW,
      isOrderUPDATE: this.isOrderUPDATE,
      ORDER: this.ORDER,
      COUNT: this.COUNT
      
    }
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    if(this.ORDER){
      let URL = 'ActiveOrdersOfUser/' + this.ORDER.ORDER_USER_ID + '/' + this.ORDER.ORDER_SHOP_ID;
      this.dbService.getListReturnPromise_ArrayOfObjectWithKey_Data(URL)
      .then((res: any[])=>{
        let ORDER_LIST = res[0].data.ORDER_LIST;
        this.COUNT = 0;
        ORDER_LIST.forEach(order=>{
          let index = this.SHOP_ITEMS_ID.indexOf(order.item);
          if(index>=0){
            this.SHOP_ITEMS_INDEX[index].count = order.amount;
            this.COUNT +=order.amount;
          }
        });
        this.isOrderUPDATE = false;
        this.closeModal();
      })
    }else{
      this.closeModal();
    }
    
  }

  checkOrderIfUpdated() {
    let count: number = 0;
    this.SHOP_ITEMS_INDEX.forEach(item => {
      count += item.count;
    })
    if (count > 0 && !this.isOrderNEW) {
      this.isOrderUPDATE = true;
    } else {
      this.isOrderUPDATE = false;
    }
  }

  checkBill(){
    console.log('check bill');
    this.closeModal();
  }

  syncOrderStatus(){
    if(this.ORDER){
      this.afService.getObject('ActiveOrdersOfUser/' + this.ORDER.ORDER_USER_ID + '/' + this.ORDER.ORDER_SHOP_ID+'/'+this.ORDER.ORDER_ID)
      .subscribe((snap)=>{
        console.log(snap);
        this.AsyncOrder = snap;
      })
    }
  }

}
