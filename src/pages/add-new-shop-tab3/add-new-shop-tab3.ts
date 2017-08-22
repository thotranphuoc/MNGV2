import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { LocalService } from '../../services/local.service';
import { GmapService } from '../../services/gmap.service';
import { iPosition } from '../../interfaces/position.interface';

declare var google: any;
@IonicPage()
@Component({
  selector: 'page-add-new-shop-tab3',
  templateUrl: 'add-new-shop-tab3.html',
})
export class AddNewShopTab3Page {
  loading: any;

  mapNewItem: any;
  userMarker: any;
  mapElement: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private localService: LocalService,
    private gmapService: GmapService,
    private geolocation: Geolocation,
    ) {
    this.loading = this.loadingCtrl.create({
        content: 'Please wait....',
        spinner: 'crescent'
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopTab3Page');
    this.initPage();
  }

  initPage() {
    setTimeout(() => {
      this.mapElement = document.getElementById('mapNewItem');
      this.initMap(this.mapElement);
    }, 1000)
  }

  initMap(mapElement) {
    this.startLoading()
    if (this.localService.isUserChosenPositionSet) {
      console.log('user location set');
      console.log(this.localService.SHOP.SHOP_LOCATION)
      this.showMap(this.localService.SHOP.SHOP_LOCATION, mapElement);
    } else {
      console.log('user location not set yet');
      this.geolocation.getCurrentPosition()
        .then((position) => {
          let pos: iPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.showMap(pos, mapElement);
          this.localService.SHOP.SHOP_LOCATION = pos;
          this.localService.isUserChosenPositionSet = true;
        })
    }
  }

  showMap(position: iPosition, mapElement) {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    console.log(mapElement, mapOptions);

    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        this.hideLoading();
        console.log(map);
        this.mapNewItem = map;
        this.gmapService.addMarkerToMap(this.mapNewItem, position).then((marker) => {
          this.userMarker = marker;
        })
        google.maps.event.addListener(this.mapNewItem, 'click', (event) => {
          this.userMarker.setMap(null);
          let positionClick = { lat: event.latLng.lat(), lng: event.latLng.lng() }
          console.log(positionClick);
          this.userMarker = new google.maps.Marker({
            position: positionClick,
            map: this.mapNewItem
          })
          this.setUserChoosenPosition(positionClick);
        })
      });
  }

  setUserChoosenPosition(position: iPosition) {
    this.localService.SHOP.SHOP_LOCATION= position;
    // this.soldItem.POSITION = position;
    this.localService.isUserChosenPositionSet = true;
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
}
