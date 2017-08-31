import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, ModalController } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';

import { iOrder } from '../../interfaces/order.interface';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-shop2',
  templateUrl: 'shop2.html',
})
export class Shop2Page {
  loading: any;
  shop: iShop = null;
  ORDER: iOrder = null;
  SHOP_ITEMS: any[] = [];
  SHOP_ITEMS_ID: any[] = [];
  SHOP_ITEMS_INDEX: any[] = [];
  USER_ID: string = null;
  isOrderNEW: boolean = true;
  isOrderUPDATE: boolean = false;
  COUNT: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private localService: LocalService,
    private afService: AngularFireService,
    private dbService: DbService,
  ) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
    this.shop = navParams.data.shop;

    this.localService.SHOP = this.shop;
    console.log(this.shop);
    this.startLoading();

    if (typeof (this.shop) !== 'undefined') {
      this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.shop.SHOP_ID)
        .then((res: any) => {
          this.SHOP_ITEMS = res.SHOP_ITEMS;
          this.SHOP_ITEMS_ID = res.SHOP_ITEMS_ID;
          this.SHOP_ITEMS_INDEX = [];
          let l = this.SHOP_ITEMS_ID.length
          for (let index = 0; index < l; index++) {
            this.SHOP_ITEMS_INDEX.push({ count: 0 });
          }
          this.hideLoading();
          this.getActiveOrder();

        })
        .catch((err) => {
          console.log(err);
          this.hideLoading();
        })
    } else {
      this.hideLoading();
      this.navCtrl.setRoot('HomePage');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Shop1Page');
  }

  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss();
  }

  go2AddFavorite() {
    console.log('add favroite clicked');
    this.navCtrl.push('FavoriteAddPage', { SHOP_ITEMS: this.SHOP_ITEMS, SHOP_ITEMS_ID: this.SHOP_ITEMS_ID, SHOP: this.shop })
  }

  go2MenuItemAdd() {
    console.log(this.shop.SHOP_ID);
    this.navCtrl.push('MenuItemAddPage', { SHOP_ID: this.shop.SHOP_ID });
  }

  selectITEM(i) {
    console.log(i);
    this.SHOP_ITEMS_INDEX[i].count++;
    this.checkOrderIfUpdated();
    this.COUNT++;
  }

  onCart() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'View Order',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.go2Shop2Order('ordering');
          }
        }, {
          text: 'Check Bill',
          handler: () => {
            console.log('Archive clicked');
            if (this.isOrderNEW) {
              alert('You dont have any order')
            } else {
              if (this.isOrderUPDATE) {
                alert('Please save your order');
                this.go2Shop2Order('ordering');
              } else {
                this.go2Shop2Order('billing');
              }
            };
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

  go2Shop2Order(action: string) {
    let ACTION = action;
    let data = {
      SHOP_ITEMS: this.SHOP_ITEMS,
      SHOP_ITEMS_ID: this.SHOP_ITEMS_ID,
      SHOP_ITEMS_INDEX: this.SHOP_ITEMS_INDEX,
      isOrderNEW: this.isOrderNEW,
      isOrderUPDATE: this.isOrderUPDATE,
      ORDER: this.ORDER,
      ACTION: ACTION,
      COUNT: this.COUNT
    };
    let orderModal = this.modalCtrl.create('Shop2OrderPage', data);
    orderModal.onDidDismiss(data => {
      console.log('onDidDismiss');
      console.log(data);
      this.SHOP_ITEMS_INDEX = data.SHOP_ITEMS_INDEX;
      this.isOrderNEW = data.isOrderNEW;
      this.isOrderUPDATE = data.isOrderUPDATE;
      this.ORDER = data.ORDER;
      this.COUNT = data.COUNT;
    })
    orderModal.present();
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

  getActiveOrder() {
    if (this.afService.getAuth().auth.currentUser) {
      this.USER_ID = this.afService.getAuth().auth.currentUser.uid;
      let URL = 'ActiveOrdersOfUser/' + this.USER_ID + '/' + this.shop.SHOP_ID;
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
          } else {
            console.log('there is no active order');
          }
        })
        .catch((err) => { console.log(err) })
    } else {
      this.USER_ID = null;
    }
  }



}
