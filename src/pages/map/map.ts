import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { GmapService } from '../../services/gmap.service';
import { LocalService } from '../../services/local.service';
import { DbService } from '../../services/db.service';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  // FirebaseObjectObservable 
} from 'angularfire2/database';

import { iPosition } from '../../interfaces/position.interface';
import { iShop } from '../../interfaces/shop.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  data: any;
  mapEl: any;
  map: any;
  loading: any;
  shops: iShop[] = [];
  shopsO: FirebaseListObservable<iShop[]>;;
  insideMapShops: iShop[] = [];
  // SHOPs_LOC: any[] = [];
  SHOPs_NEARBY: any[] = [];
  USER_LOC: iPosition;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private gmapService: GmapService,
    private localService: LocalService,
    private dbService: DbService,
    private afDB: AngularFireDatabase
  ) {
    this.data = this.navParams.data;
    // this.USER_LOC = typeof (this.data.USER_LOCATION) === 'undefined' ? null : this.data.USER_LOCATION;
    // this.SHOPs_LOC = typeof(this.data.SHOPS_LOCATION) ==='undefined'? null : this.data.SHOPS_LOCATION;
    console.log(this.data, this.USER_LOC);
    

    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ...');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.startLoading();
    setTimeout(() => {
      this.mapEl = document.getElementById('map');
      this.initMap(this.mapEl)
    }, 1000)
  }

  initMap(mapElement) {
    this.geolocation.getCurrentPosition()
      .then((position) => {
        // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let pos: iPosition = { lat: position.coords.latitude, lng: position.coords.longitude }
        this.gmapService.setUserCurrentPosition(pos);
        this.showMap(pos, mapElement)
      })
      .catch((err) => {
        this.gmapService.getUserCurrentPosition()
          .then((position: iPosition) => {
            console.log(position);
            this.showMap(position, mapElement)
            this.gmapService.setUserCurrentPosition(position);
          }, err => {
            console.log(err);
            alert('No gps signal. Your location cannot be detected now.');
            let pos: iPosition = { lat: 10.778168043677463, lng: 106.69638633728027 };
            this.gmapService.setUserCurrentPosition(pos);
            this.showMap(pos, mapElement);
          })
          .catch((err) => { console.log(err) });
      })

  }

  showMap(position: iPosition, mapElement) {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      fullscreenControl: false
    }

    console.log(mapElement, mapOptions);
    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        console.log(map);
        this.map = map;
        // when maps is loaded and become idle
        this.gmapService.addBlueDotToMap(this.map, mapOptions.center);
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.hideLoading();
          this.loadShops();
        })
      })
  }

  loadShops() {
    if (!this.localService.SHOP_LOADED) {
      console.log('localService.SHOP_LOADED = false');
      this.afDB.list('ShopsLOCATION').forEach((shops_loc: any[]) => {
        console.log(shops_loc);
        this.localService.SHOPs_LOCATION = shops_loc;
        this.localService.SHOP_LOADED = true;
        this.checkAndLoadMarker(this.localService.SHOPs_LOCATION);
      })
    } else {
      console.log('localService.SHOP_LOADED = true');
      this.checkAndLoadMarker(this.localService.SHOPs_LOCATION);
    }

  }

  checkAndLoadMarker(shops_loc: any[]) {
    if (shops_loc.length > 0) {
      console.log(shops_loc);
      this.insideMapShops = [];
      shops_loc.forEach(shop => {
        let POS: iPosition = { lat: shop.lat, lng: shop.lng }
        console.log(POS);
        if (this.gmapService.isPositionInsideMap(POS, this.map)) {
          this.dbService.getOneItemReturnPromise('Shops/' + shop.ID).then((shopData: iShop) => {
            this.gmapService.addMarkerToMapWithIDReturnPromiseWithMarker(this.map, POS, shopData);
            this.insideMapShops.push(shopData);
            console.log(shopData);
          })

        } else {
          console.log('out of map');
        }
      })
    } else {
      console.log('this.localService.SHOPs_LOCATION = 0');
    }
  }




  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss().catch((err) => { console.log(err) });
  }

  go2List() {
    console.log('go2ListPage');
    this.navCtrl.push('ListPage', { shops: this.insideMapShops });
  }

  // go2AddNewShop() {
  //   this.navCtrl.push('ShopAddNewPage');
  // }

  // go2SearchShop() {
  //   let modal = this.modalCtrl.create('SearchShopPage');
  //   modal.onDidDismiss((data)=>{
  //     console.log(data);
  //     if(typeof(data) !== 'undefined'){
  //       this.go2Shop(data.SHOP);
  //     }
  //   })
  //   modal.present();
  // }

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
    if('SHOP_OTHER' in shop){
      console.log(shop.SHOP_OTHER);

      // if isVERIFIED exist
      if('isVERIFIED' in shop.SHOP_OTHER){
        if(shop.SHOP_OTHER.isVERIFIED){
          console.log('isVERIFIED TRUE');
          this.navCtrl.setRoot('Shop2Page', { SHOP: shop });
        }else{
          console.log('isVERIFIED FALSE');
          this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
        }
      }else{
        console.log('isVERIFIED not exist');
        this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
      }
    }else{
      console.log('no SHOP_OTHER')
      this.navCtrl.setRoot('Shop1Page', { SHOP: shop });
    }
  }


}
