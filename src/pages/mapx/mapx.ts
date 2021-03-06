import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';

import { GmapService } from '../../services/gmap.service';

import { DbService } from '../../services/db.service';
import { iPosition } from '../../interfaces/position.interface';
import { iShop } from '../../interfaces/shop.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-mapx',
  templateUrl: 'mapx.html',
})
export class MapxPage {
  data: any;
  mapEl: any;
  map: any;
  loading: any;
  userMarker: any;
  CURRENT_LOCATION: iPosition = null;
  SHOP: iShop;
  SHOPS: iShop[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    private gmapService: GmapService,
    private dbService: DbService,
  ) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
    // this.startLoading();
    this.data = this.navParams.data;
    if (typeof (this.data.SHOPS) !== 'undefined') {
      this.SHOP = this.data.SHOP;
      this.SHOPS = this.data.SHOPS;
      // this.CURRENT_LOCATION = this.SHOP.SHOP_LOCATION;
      this.gmapService.getUserCurrentPosition()
        .then((pos: iPosition) => {
          this.CURRENT_LOCATION = pos;
          console.log(this.SHOPS, this.data);
          this.startLoadMap();
        })

    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  startLoadMap() {
    this.startLoading();
    setTimeout(() => {
      this.mapEl = document.getElementById('map');
      this.initMap(this.mapEl)
    }, 1000)
  }

  initMap(mapElement) {
    console.log('start initMap()')
    if (this.CURRENT_LOCATION) {
      console.log('user location set');
      console.log(this.CURRENT_LOCATION)
      this.showMap(this.CURRENT_LOCATION, mapElement);
    } else {
      console.log('user location not set yet');
      this.gmapService.getUserCurrentPosition()
        .then((pos: iPosition) => {
          console.log(pos);
          this.showMap(pos, mapElement);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  showMap(position: iPosition, mapElement) {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      // center: latLng,
      center: this.SHOPS[0].SHOP_LOCATION,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      fullscreenControl: false
    }

    console.log(mapElement, mapOptions);
    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        // this.hideLoading();
        console.log(map);
        this.map = map;
        // when maps is loaded and become idle
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.hideLoading();
          this.gmapService.addBlueDotToMap(this.map, this.CURRENT_LOCATION);
          this.SHOPS.forEach((SHOP: iShop) => {
            this.gmapService.addMarkerToMapWithIDReturnPromiseWithMarker(this.map, SHOP.SHOP_LOCATION, SHOP)
              .then((res) => { console.log(res) })
              .catch((err) => { console.log(err) });
          })
          console.log(this.SHOP);
        })
      })
      .catch((err) => { console.log(err); })
  }

  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss()
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) });
  }

}