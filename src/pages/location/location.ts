import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GmapService } from '../../services/gmap.service';
import { iPosition } from '../../interfaces/position.interface';
import { iShop } from '../../interfaces/shop.interface';
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  loading: any;
  mapEl: any;
  map: any;
  userMarker: any;
  CURRENT_LOCATION: iPosition = null;
  SHOP: iShop;
  NEW_SELECTED_LOCATION: iPosition = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    private geolocation: Geolocation,
    private gmapService: GmapService,
  ) {
    this.CURRENT_LOCATION = this.navParams.get('CURRENT_LOCATION');
    this.SHOP = this.navParams.get('SHOP');
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
    this.startLoading();
    setTimeout(() => {
      this.mapEl = document.getElementById('map');
      this.initMap(this.mapEl)
    }, 1000)
  }

  initMap(mapElement) {
    if (this.CURRENT_LOCATION) {
      console.log('user location set');
      console.log(this.CURRENT_LOCATION)
      this.showMap(this.CURRENT_LOCATION, mapElement);
    } else {
      console.log('user location not set yet');
      this.geolocation.getCurrentPosition()
        .then((position) => {
          let pos: iPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.showMap(pos, mapElement);
        })
    }
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
        this.hideLoading();
        console.log(map);
        this.map = map;
        // when maps is loaded and become idle
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.hideLoading();
          this.gmapService.addMarkerToMap(this.map, position).then((marker) => {
            this.userMarker = marker;
          });
        })

        google.maps.event.addListener(this.map, 'click', (event) => {
          this.userMarker.setMap(null);
          let positionClick = { lat: event.latLng.lat(), lng: event.latLng.lng() }
          console.log(positionClick);
          this.userMarker = new google.maps.Marker({
            position: positionClick,
            map: this.map
          })
          this.NEW_SELECTED_LOCATION = positionClick;
        })

      })
  }

  setLocation(){
    this.viewCtrl.dismiss({NEW_LOCATION: this.NEW_SELECTED_LOCATION});
  }

  cancelLocation(){
    this.viewCtrl.dismiss({NEW_LOCATION: this.CURRENT_LOCATION});
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

}
