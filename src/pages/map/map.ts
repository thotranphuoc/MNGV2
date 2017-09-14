import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { GmapService } from '../../services/gmap.service';
import { LocalService } from '../../services/local.service';
import { DbService } from '../../services/db.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { iPosition } from '../../interfaces/position.interface';
import { iShop } from '../../interfaces/shop.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  mapEl: any;
  map: any;
  loading: any;
  shops: iShop[] = [];
  shopsO: FirebaseListObservable<iShop[]>;;
  insideMapShops: iShop[] = [];
  SHOPs_LOC: any[] = [];
  SHOPs_NEARBY: any[] = [];
  USER_LOC: iPosition;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private gmapService: GmapService,
    private localService: LocalService,
    private dbService: DbService,
    private afDB: AngularFireDatabase
  ) {
    this.USER_LOC = this.navParams.get('LOC');
    console.log(this.USER_LOC);
    if (this.localService.shopsLoaded) {
      this.SHOPs_NEARBY = this.localService.SHOPs_NEARBY;
      this.SHOPs_LOC = this.localService.SHOPs_LOCATION;
    } else {
      this.afDB.list('ShopsLOCATION')
      // this.afDB.list('ShopsLOCATION')
      .forEach((shops_loc: any[]) => {
        this.localService.SHOPs_LOCATION = shops_loc;
        this.SHOPs_LOC = shops_loc;
        // this.shopsLoaded = true;
        this.localService.shopsLoaded = true;
        console.log(this.SHOPs_LOC);
      })
    }

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
    // this.gmapService.getCurrentPosition()
    this.geolocation.getCurrentPosition()
      .then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.hideLoading();
          this.loadShops();
        })
      })
  }

  loadShops() {
    if (!this.localService.shopsLoaded) {
      // this.shops = [];
      this.afDB.list('Shops_LOC').forEach((shops_loc: any[]) => {
        console.log(shops_loc);
        this.SHOPs_LOC = shops_loc;
        this.localService.shopsLoaded = true;
        this.checkAndLoadMarker(this.SHOPs_LOC);
      })
    }else{
      this.checkAndLoadMarker(this.SHOPs_LOC);
    }
    
  }

  checkAndLoadMarker(shops: any[]) {
    if(shops.length>0){
      console.log(shops);
      this.insideMapShops = [];
      shops.forEach(shop => {
        let POS: iPosition = {lat: shop.lat, lng: shop.lng}
        console.log(POS);
        if (this.gmapService.isPositionInsideMap(POS, this.map)) {
          // this.afDB.object('Shops/' + shop.ID).subscribe((shopData: iShop) => {
          //   console.log(shopData);
          //   this.gmapService.addMarkerToMapWithIDReturnPromiseWithMarker(this.map, POS, shopData);
          //   this.insideMapShops.push(shopData);
          // })
          this.dbService.getOneItemReturnPromise('Shops/'+shop.ID).then((shopData:iShop)=>{
            this.gmapService.addMarkerToMapWithIDReturnPromiseWithMarker(this.map, POS, shopData);
            this.insideMapShops.push(shopData);
            console.log(shopData);
          })
  
        }else{
          console.log('out of map');
        }
      })
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
    this.loading.dismiss();
  }

  go2List() {
    console.log('go2ListPage');
    this.navCtrl.push('ListPage', { shops: this.insideMapShops });
  }

  go2AddNewShop() {
    this.navCtrl.push('ShopAddNewPage');
  }

}
