import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, AlertController } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { LocalService } from '../../services/local.service';
import { GmapService } from '../../services/gmap.service';
import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { CrudService } from '../../services/crud.service';

import { iShop } from '../../interfaces/shop.interface';
import { iPosition } from '../../interfaces/position.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-add-new-shop-tab4',
  templateUrl: 'add-new-shop-tab4.html',
})
export class AddNewShopTab4Page {
  SHOP_IMAGES: string[] = null;
  SHOP: iShop;
  mapreview: any;
  mapElement: any;
  loading: any;

  // Review & post
  isInfoFullFilled: boolean = true;
  hasPosted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private app: App,
    private alertCtrl: AlertController,
    private appService: AppService,
    private afService: AngularFireService,
    private gmapService: GmapService,
    private localService: LocalService,
    private crudService: CrudService,
    private dbService: DbService) {
    this.SHOP = this.localService.SHOP;
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopTab4Page');
  }

  ionViewWillEnter() {
    this.SHOP_IMAGES = this.localService.SHOP_IMAGES;
    this.SHOP = this.localService.SHOP;
    console.log(this.localService.SHOP.SHOP_LOCATION);

    setTimeout(() => {
      if (this.SHOP.SHOP_LOCATION) {
        this.initMap(this.SHOP.SHOP_LOCATION)
      } else {
        this.initMap({ lat: 0, lng: 0 })
      }
    }, 1000)
  }

  initMap(position: iPosition) {
    let mapElement = document.getElementById('mapreview');
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOption = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.gmapService.initMap(mapElement, mapOption)
      .then((map) => {
        this.mapreview = map;
        this.gmapService.addMarkerToMap(this.mapreview, position).then((marker) => {
        })
      })
  }

  createShop() {
    this.hasPosted = true;
    console.log(this.SHOP);
    this.checkInfoFullFilled();
    if (this.isInfoFullFilled) {
      if (this.afService.getAuth().auth.currentUser) {
        // user signed in
        this.SHOP.SHOP_OWNER = this.afService.getAuth().auth.currentUser.uid;
        this.SHOP.SHOP_DATE_CREATE = this.appService.getCurrentDataAndTime().toString();
        console.log(this.SHOP);
        this.addNewShop(this.SHOP, this.SHOP_IMAGES);
      } else {
        // user not signed in yet
        this.hasPosted = false;
        this.alertMsgWithConfirmationToGoToPage();
      }
    } else {
      this.appService.alertMsg('Error', 'info not full filled')
    }
  }

  addNewShop(SHOP: iShop, images: string[]) {
    console.log(SHOP);
    // this.crudService.createNewShop(SHOP, images)
    //   .then((res) => {
    //     console.log(res);
    //     this.hideLoading();
    //     this.resetShop();
    //     this.go2Page('HomePage');
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.appService.alertError('Error', err.toString())
    //     this.hasPosted = false;
    //   })
  }

  alertMsgWithConfirmationToGoToPage() {
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
            // this.navCtrl.popToRoot();
            this.navCtrl.push('AccountPage', { action: 'request-login' });
          }
        }
      ]
    }).present();
  }

  checkInfoFullFilled() {
    this.isInfoFullFilled = true;
    if (this.SHOP.SHOP_NAME == null || this.SHOP.SHOP_NAME == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_NAME, ' is missed');
    }
    if (this.SHOP.SHOP_ADDRESS == null || this.SHOP.SHOP_ADDRESS == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_ADDRESS, ' is missed');
    }

    if (this.SHOP_IMAGES == null) {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_NAME, 'image is missed');
    }

    console.log(this.SHOP.SHOP_NAME);
    console.log(this.SHOP.SHOP_ADDRESS);
    console.log(this.isInfoFullFilled, '<--isInfoFullfilled?');
  }

  // LOADING
  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 20000)
  }

  private hideLoading() {
    this.loading.dismiss();
  }

  private hideLoadingWithMessage(message: string) {
    this.loading.dismiss();
    this.appService.alertMsg('Alert', message);
    this.go2Page('HomePage')
  }

  go2Page(page: string) {
    const root = this.app.getRootNav();
    root.setRoot(page);
  }

  resetShop() {
    this.localService.SHOP = this.localService.SHOP_DEFAULT;
  }

}
