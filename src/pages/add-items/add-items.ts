import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, Loading, AlertController } from 'ionic-angular';

import { iItem } from '../../interfaces/item.interface';
import { iShop } from '../../interfaces/shop.interface';
import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { CrudService } from '../../services/crud.service';
import { DbService } from '../../services/db.service';
@IonicPage()
@Component({
  selector: 'page-add-items',
  templateUrl: 'add-items.html',
})
export class AddItemsPage {
  loading: Loading;
  isLoading: boolean = false;
  ITEM: iItem = null;
  ITEMS: iItem[] = [];
  SHOP: iShop;
  SHOP_ID: string = null;
  base64Images: string[] = [];
  isInfoFullFilled: boolean = false;
  hasPosted: boolean = false;
  isItem2Update: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private localService: LocalService,
    private crudService: CrudService,
    private afService: AngularFireService,
    private appService: AppService,
    private dbService: DbService
  ) {

    this.ITEM = this.localService.get_ITEM_DEFAULT();
    console.log(this.ITEM);
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemsPage');
    // let offsetHeight = document.getElementById('allShow').offsetHeight;
    // console.log(offsetHeight);
    // let divListItem = document.getElementById('listItem').setAttribute('top',offsetHeight.toString()+'px');
  }

  addOneMore() {
    // this.ITEMS.push(this.localService.ITEM_DEFAULT);
    console.log(this.ITEM);
  }

  updateItem(item, i) {
    console.log(item, i);
    this.ITEM = item;
    this.isItem2Update = true;
  }

  doUpdateItem() {
    console.log(this.ITEM);
    this.crudService.updateItem(this.ITEM);
    this.isItem2Update = false;
    this.resetItem();
  }

  addOne() {
    this.resetItem();
    this.isItem2Update = false;
  }

  selectPhoto() {
    console.log('selectPhoto');
    let photosModal = this.modalCtrl.create('PhotoSelectPage', { KEY: this.ITEM.ITEM_NAME_EN, PHOTOS: this.base64Images });
    photosModal.onDidDismiss((data) => {
      console.log(data);
      this.base64Images = data.PHOTOS;
      this.ITEM.ITEM_IMG_SHARED = true;
      this.ITEM.ITEM_IMAGES = data.PHOTOS;
      // if(this.base64Images){
      //   this.base64Images = this.base64Images.concat(data.PHOTOS)
      // }else{
      //   this.base64Images = data.PHOTOS;
      // }
    });
    photosModal.present().then((res)=>{ console.log(res )}).catch((err)=>{ console.log(err)});
  }

  go2SearchShop() {
    let modal = this.modalCtrl.create('SearchShopPage');
    modal.onDidDismiss((data) => {
      console.log(data);
      if (typeof (data) !== 'undefined') {
        this.SHOP = data.SHOP;
        this.SHOP_ID = this.SHOP.SHOP_ID;
        this.afService.getList('Shop_Items/' + this.SHOP_ID)
          .subscribe((ITEMS_ID: any[]) => {
            console.log(ITEMS_ID);
            this.ITEMS = [];
            ITEMS_ID.forEach(ITEM_ID => {
              this.dbService.getOneItemReturnPromise('Items/' + ITEM_ID.$value)
                .then((res: iItem) => {
                  console.log(res);
                  this.ITEMS.push(res);
                })
                .catch((err) => {
                  console.log(err);
                })
            });
            this.ITEMS.reverse();
          })
      } else {
        this.SHOP = null;
      }
    })
    modal.present().then((res)=>{ console.log(res )}).catch((err) => { console.log(err) });
  }

  createItem() {
    this.checkInfoFullFilled();
    console.log(this.base64Images);
    if (this.isInfoFullFilled) {
      console.log(this.base64Images);
      if (this.afService.getAuth().auth.currentUser) {
        // user signed in
        this.startLoading();
        this.ITEM.ITEM_DATE_CREATE = this.appService.getCurrentDataAndTime().toString();
        this.ITEM.ITEM_SHOP_ID = this.SHOP_ID;
        console.log(this.ITEM);
        console.log(this.base64Images);
        this.crudService.createItem(this.ITEM.ITEM_SHOP_ID, this.ITEM, this.base64Images)
          .then(() => {
            console.log('item create successfully');
            this.hideLoading();
            this.resetItem();
            // this.navCtrl.pop();
          })
          .catch((err) => {
            this.showErr1(err);
            this.hideLoading();
          })
      } else {
        // user not signed in yet
        this.hasPosted = false;
        this.alertMsgWithConfirmationToGoToAccountPage();
      }

    } else {
      // info not fullfilled
      this.hasPosted = false;
      this.appService.alertMsg('Notice', 'Information or Photo missing');
    }
  }

  checkInfoFullFilled() {
    this.isInfoFullFilled = true;
    if (!this.SHOP_ID) {
      this.isInfoFullFilled = false;
      this.appService.alertError('Error', 'Shop not selected yet');
    }
    if (this.ITEM.ITEM_NAME_LOCAL == null || this.ITEM.ITEM_NAME_LOCAL == '') {
      this.isInfoFullFilled = false;
      console.log(this.ITEM.ITEM_NAME_LOCAL, 'NAME_LOCAL is missed');
    }
    if (this.ITEM.ITEM_NAME_EN == null || this.ITEM.ITEM_NAME_EN == '') {
      this.isInfoFullFilled = false;
      console.log(this.ITEM.ITEM_NAME_EN, 'NAME_EN is missed');
    }
    if (this.ITEM.ITEM_PRICE == null) {
      this.isInfoFullFilled = false;
      console.log(this.ITEM.ITEM_PRICE, 'PRICE is missed');
    }
    if (this.ITEM.ITEM_SIZE == null || this.ITEM.ITEM_SIZE == '') {
      this.isInfoFullFilled = false;
      console.log(this.ITEM.ITEM_SIZE, 'size is missed');
    }

    if (this.base64Images.length < 1) {
      this.isInfoFullFilled = false;
      console.log(this.ITEM.ITEM_IMAGES, 'images is missed');
    }

    console.log(this.isInfoFullFilled, '<--isInfoFullfilled?');
  }

  // LOADING
  private startLoading() {
    this.loading.present();
    this.isLoading = true;
    setTimeout(() => {
      if (this.isLoading) {
        this.hideLoading();
      }
    }, 20000)
  }

  private hideLoading() {
    if(this.isLoading){
      this.loading.dismiss().catch((err) => { console.log(err) });
      this.isLoading = false;
    }else{
      console.log('isLoading', this.isLoading);
    }
  }

  alertMsgWithConfirmationToGoToAccountPage() {
    this.alertCtrl.create({
      title: 'Not Signed',
      message: 'Plz login to continue',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('go to Account page to login ');
            this.navCtrl.push('AccountPage', { action: 'request-login' });
          }
        }
      ]
    }).present();
  }

  showErr1(err) {
    console.log(err);
    this.appService.alertError('Error', err);
    this.hasPosted = false;
  }

  selectCategory() {
    console.log('select Category');
    if (typeof (this.SHOP) !== 'undefined') {
      console.log(this.SHOP.SHOP_CATEGORIES);
      if (typeof (this.SHOP.SHOP_CATEGORIES) !== 'undefined') {
        let alert = this.alertCtrl.create();
        alert.setTitle('Category:');
        this.SHOP.SHOP_CATEGORIES.forEach((cat, index) => {
          alert.addInput({
            type: 'radio',
            label: cat,
            value: cat,
            checked: index == 0 ? true : false
          });
        });
        alert.addButton('Cancel');
        alert.addButton({
          text: 'OK',
          handler: data => {
            console.log(data);
            this.ITEM.ITEM_CATEGORY = data;
          }
        });
        alert.present();
      } else {
        this.appService.alertError('Error', 'Please add category for shop first');
      }
    } else {
      this.appService.alertError('Error', 'Please select shop first');
    }

  }


  resetItem() {
    this.ITEM = {
      ITEM_ID: null,
      ITEM_NAME_LOCAL: null,
      ITEM_NAME_EN: null,
      ITEM_IMAGES: [],
      ITEM_PRICE: null,
      ITEM_SIZE: null,
      ITEM_DATE_CREATE: null,
      ITEM_SHOP_ID: null,
      ITEM_ON_SALE: false,
      ITEM_NEW: true,
      ITEM_VISIBLE: true,
      ITEM_IMG_SHARED: false,
      ITEM_CATEGORY: 'Drinks',
      ITEM_OTHER: null
    }
    console.log(this.ITEM);
  }

}
