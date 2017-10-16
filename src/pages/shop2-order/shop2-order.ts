import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { CrudService } from '../../services/crud.service';

import { iItem } from '../../interfaces/item.interface';
import { iOrderList } from '../../interfaces/order-list.interface';
import { iOrder } from '../../interfaces/order.interface';
import { Subscription } from 'rxjs/Subscription';
@IonicPage()
@Component({
  selector: 'page-shop2-order',
  templateUrl: 'shop2-order.html',
})
export class Shop2OrderPage {
  USER_ID: string;
  ORDER: iOrder;
  SHOP: any;
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
  TABLE: string = null;
  NOTES: string = null;
  subscription: Subscription;
  isSubscribed: boolean = false;
  isNoteEdited: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private crudService: CrudService,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService
  ) {
    this.data = this.navParams.data;
    this.SHOP = this.data.SHOP;
    this.SHOP_ITEMS = this.data.SHOP_ITEMS
    this.SHOP_ITEMS_ID = this.data.SHOP_ITEMS_ID;
    this.SHOP_ITEMS_INDEX = this.data.SHOP_ITEMS_INDEX;
    this.isOrderNEW = this.data.isOrderNEW;
    this.isOrderUPDATE = this.data.isOrderUPDATE;
    this.ORDER = this.data.ORDER;
    this.ACTION = this.data.ACTION;
    this.COUNT = this.data.COUNT;
    this.TABLE = typeof(this.data.TABLE) !=='undefined'? this.data.TABLE : null ;
    console.log(this.data);
    this.calTotal();
    this.syncOrderStatus()
  }

  calTotal() {
    this.TOTAL = 0;
    this.SHOP_ITEMS.forEach((element, index) => {
      this.TOTAL += element.ITEM_PRICE * this.SHOP_ITEMS_INDEX[index].count
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Shop2OrderPage');
  }

  subtract(i: number) {
    
    if (this.SHOP_ITEMS_INDEX[i].count>0) {
      this.SHOP_ITEMS_INDEX[i].count--;
      this.COUNT--;
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

  createORDER() {
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
    // let TABLE = this.TABLE;
    this.ORDER = {
      ORDER_ID: null,
      ORDER_SHOP_ID: SHOP_ID,
      ORDER_USER_ID: USER_ID,
      ORDER_STAFT_ID: USER_ID,
      ORDER_STATUS: 'SENDING',
      ORDER_DATE_CREATE: DATETIME,
      ORDER_DATE_CLOSE: null,
      ORDER_TABLE: this.TABLE,
      ORDER_LIST: ORDER_LIST,
      ORDER_NOTES: this.NOTES,
      ORDER_OTHER: null
    };
    let DATE = this.appService.getCurrentDate();
    if ( this.TABLE === null || this.ORDER.ORDER_TABLE === null || this.ORDER.ORDER_LIST.length < 1) {
      alert('Select table and favorite items please');
    } else {
      if (USER_ID) {
        console.log(this.ORDER);
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
        // this.navCtrl.push('AccountPage', { action: 'request-login' });
        let modal = this.modalCtrl.create('AccountPage', { action: 'request-login' });
        modal.onDidDismiss(((data)=>{
          console.log(data);
          this.getActiveOrder();
        }))
        modal.present();
      }
    }
  }

  updateOrder() {
    console.log(this.ORDER);
    let ORDER_LIST: iOrderList[] = [];
    this.SHOP_ITEMS_INDEX.forEach((element, index: number, array) => {
      if (element.count > 0) {
        ORDER_LIST.push({ item: this.SHOP_ITEMS[index].ITEM_ID, amount: element.count });
      }
    });
    console.log(ORDER_LIST);
    // this.dbService.getOneItemReturnPromise()
    this.crudService.updateOrder(ORDER_LIST, this.TABLE, this.ORDER).then((res) => {
      console.log(res);
      this.isOrderUPDATE = false;
      this.closeModal();
    }).catch((err) => {
      console.log(err);
    })
  }

  closeModal() {
    // this.viewCtrl.dismiss().catch((err) => { console.log(err)});
    let data = {
      SHOP_ITEMS: this.SHOP_ITEMS,
      SHOP_ITEMS_ID: this.SHOP_ITEMS_ID,
      SHOP_ITEMS_INDEX: this.SHOP_ITEMS_INDEX,
      isOrderNEW: this.isOrderNEW,
      isOrderUPDATE: this.isOrderUPDATE,
      ORDER: this.ORDER,
      COUNT: this.COUNT,
      TABLE: this.TABLE

    }
    this.viewCtrl.dismiss(data)
      .catch((err)=>{ console.log(err)})
  }

  cancel() {
    if (this.ORDER) {
      let URL = 'ActiveOrdersOfUser/' + this.ORDER.ORDER_USER_ID + '/' + this.ORDER.ORDER_SHOP_ID;
      this.dbService.getListReturnPromise_ArrayOfObjectWithKey_Data(URL)
        .then((res: any[]) => {
          let ORDER_LIST = res[0].data.ORDER_LIST;
          this.COUNT = 0;
          ORDER_LIST.forEach(order => {
            let index = this.SHOP_ITEMS_ID.indexOf(order.item);
            if (index >= 0) {
              this.SHOP_ITEMS_INDEX[index].count = order.amount;
              this.COUNT += order.amount;
            }
          });
          this.isOrderUPDATE = false;
          this.closeModal();
        })
        .catch((err)=>{ console.log(err)})
    } else {
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

  checkBill() {
    console.log('check bill');
    this.closeModal();
  }

  syncOrderStatus() {
    if (this.ORDER) {
      this.subscription = this.afService.getObject('ActiveOrdersOfUser/' + this.ORDER.ORDER_USER_ID + '/' + this.ORDER.ORDER_SHOP_ID + '/' + this.ORDER.ORDER_ID)
        .subscribe((snap) => {
          console.log(snap);
          this.AsyncOrder = snap;
        });
      this.isSubscribed = true;
    }
  }

  selectTable() {
    let modol = this.modalCtrl.create('TablePage', { SHOP: this.SHOP});
    modol.onDidDismiss((table) => {
      console.log(table);
      this.TABLE = table.TABLE;
      this.isOrderUPDATE = true;
    })
    modol.present();
  }

  getActiveOrder() {
    if (this.afService.getAuth().auth.currentUser) {
      this.USER_ID = this.afService.getAuth().auth.currentUser.uid;
      let SHOP_ID = this.SHOP_ITEMS[0].ITEM_SHOP_ID;
      let URL = 'ActiveOrdersOfUser/' + this.USER_ID + '/' + SHOP_ID;
      this.dbService.getListReturnPromise_ArrayOfObjectWithKey_Data(URL)
        .then((res: any[]) => {
          console.log(res);
          if (res.length > 0) {
            alert('You have order from this shop. Would you like to continue?');
            this.ORDER = res[0].data;
            this.COUNT = 0;
            this.ORDER.ORDER_LIST.forEach(order => {
              let index = this.SHOP_ITEMS_ID.indexOf(order.item);
              if (index >= 0) {
                this.SHOP_ITEMS_INDEX[index].count = order.amount;
                this.COUNT += order.amount;
              }
            });
            this.isOrderNEW = false;
            this.TABLE = this.ORDER.ORDER_TABLE;
          } else {
            console.log('there is no active order');
          }
        })
        .catch((err) => { console.log(err) })
    } else {
      this.USER_ID = null;
    }
  }

  ionViewWillLeave(){
    if(this.isSubscribed){
      this.subscription.unsubscribe();
    }
  }

  onKeyUp(e){
    this.isOrderUPDATE = true;
    this.ORDER.ORDER_NOTES = this.NOTES;
    console.log(this.NOTES);
  }

  editNote(){
    console.log('editNote');
    this.isNoteEdited = true;
    this.NOTES = this.AsyncOrder.ORDER_NOTES;
  }

  editCount(i){
    console.log(i);
    let count = this.SHOP_ITEMS_INDEX[i].count;
    console.log(count);
    let alert = this.alertCtrl.create({
      title: 'Edit',
      inputs: [
        {
          name: 'number',
          placeholder: count
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            console.log(data, data.number);
            if(!isNaN(data.number)){
              this.SHOP_ITEMS_INDEX[i].count = Number(data.number);
              this.checkOrderIfUpdated();
            }else{
              this.appService.alertMsg('Error', 'Please enter a number');
            }
          }
        }
      ]
    })
    alert.present();
  }

}

/**
 * ACTION === billing: when user click Check Bill
 * 
 *ACTION === ordering: when user click View Order

 */ 
