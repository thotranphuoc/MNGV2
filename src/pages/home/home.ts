import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { iPosition } from '../../interfaces/position.interface';
// import { Geolocation } from '@ionic-native/geolocation';
import { GmapService } from '../../services/gmap.service';
import { ShopService } from '../../services/shop.service';
import { LocalService } from '../../services/local.service';
// import * as firebase from 'firebase/app';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  USER_LOCATION: iPosition;
  USER_LAST_TIME: string;
  USER_ID = null;
  IMG = '../../assets/imgs/menugo_144x144.png';
  SHOPS_ID: any[] = [];
  SHOPS_LOCATION: any[] = [];
  loading: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dbService: DbService,
    private afAuth: AngularFireAuth,
    // private geolocation: Geolocation,
    private gmapService: GmapService,
    private shopService: ShopService,
    private localService: LocalService
  ) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });


    this.startLoading();
    this.gmapService.getUserCurrentPosition()
      .then((pos: iPosition) => {
        this.USER_LOCATION = pos;
        this.getShopsNearby(this.USER_LOCATION.lat, this.USER_LOCATION.lng);
      })
      .catch((err) => {
        console.log(err);
        this.hideLoading();
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    // this.startLoading();
  }

  go2MapPage() {
    let data = {
      USER_LOCATION: this.USER_LOCATION,
      SHOPS_ID: this.SHOPS_ID,
      SHOPS_LOCATION: this.SHOPS_LOCATION
    }
    this.navCtrl.setRoot('MapPage', data);
  }

  getShopsNearby(LAT: number, LNG: number) {

    if (!this.localService.SHOP_LOADED) {
      this.shopService.getShopsNearBy(LAT, LNG)
        .then((res: any) => {
          console.log(res);
          this.SHOPS_ID = res.SHOP_IDs;
          this.SHOPS_LOCATION = res.SHOP_locations;
          this.localService.SHOPs_LOCATION = res.SHOP_locations;
          this.localService.SHOPs_NEARBY = res.SHOP_IDs;
          this.localService.SHOP_LOADED = true;
          this.shopService.getShopsInDetail(res.SHOP_IDs);
          this.hideLoading();
        })
        .catch((err) => {
          console.log(err)
          this.hideLoading();
          this.localService.SHOP_LOADED = false;
        })
    } else {
      console.log('Shop list already loaded');
      this.hideLoading();
    }
    // this.shopService.getShops(LAT, LNG);
  }

  go2SearchShop() {
    let modal = this.modalCtrl.create('SearchShopPage');
    modal.onDidDismiss((data) => {
      console.log(data);
      if (typeof (data) !== 'undefined') {
        if (typeof (data.PAGE) !== 'undefined') {
          this.go2Page(data, data.PAGE);
        } else {
          this.go2Shop(data.SHOP);
        }
      }
    })
    modal.present().catch((err) => { console.log(err) });
  }

  go2Page(data, PAGE) {
    this.navCtrl.setRoot(PAGE, data)
      .then((res) => { console.log(res); })
      .catch((err) => { console.log(err); })
  }

  go2Shop(shop: iShop) {
    console.log(shop.SHOP_OTHER);
    if ('SHOP_OTHER' in shop) {
      console.log(shop.SHOP_OTHER);

      // if isVERIFIED exist
      if ('isVERIFIED' in shop.SHOP_OTHER) {
        if (shop.SHOP_OTHER.isVERIFIED) {
          console.log('isVERIFIED TRUE');
          this.navCtrl.setRoot('Shop2Page', { SHOP: shop });
        } else {
          console.log('isVERIFIED FALSE');
          this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
        }
      } else {
        console.log('isVERIFIED not exist');
        this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
      }
    } else {
      console.log('no SHOP_OTHER')
      this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
    }
  }

  go2ListPage() {
    let data = {
      USER_LOCATION: this.USER_LOCATION,
      SHOPS_ID: this.SHOPS_ID,
      SHOPS_LOCATION: this.SHOPS_LOCATION
    }
    this.navCtrl.setRoot('ListPage', data);
  }

  startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 15000)
  }

  hideLoading() {
    this.loading.dismiss().catch((err) => { console.log(err) });
  }

}


