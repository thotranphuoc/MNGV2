import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
// import { Geolocation } from '@ionic-native/geolocation';
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
  data: any;
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
    // private geolocation: Geolocation,
    private gmapService: GmapService,
  ) {
    this.data = this.navParams.data;
    console.log(this.data);
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
    console.log('start initMap()')
    if (this.CURRENT_LOCATION) {
      console.log('user location set');
      console.log(this.CURRENT_LOCATION)
      this.showMap(this.CURRENT_LOCATION, mapElement);
    } else {
      console.log('user location not set yet');
      // this.geolocation.getCurrentPosition()
      //   .then((position) => {
      //     let pos: iPosition = {
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude
      //     }
      //     this.showMap(pos, mapElement);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     this.gmapService.getUserCurrentPosition()
      //       .then((pos: iPosition) => {
      //         console.log(pos);
      //         this.showMap(pos, mapElement);
      //       })
      //       .catch((err) => {
      //         console.log(err);
      //       })
      //   });
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
            this.NEW_SELECTED_LOCATION = position;
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
      .catch((err) => { console.log(err); })
  }

  setLocation() {
    let NEW_LOCATION = {
      lat: Number(this.NEW_SELECTED_LOCATION.lat.toFixed(5)),
      lng: Number(this.NEW_SELECTED_LOCATION.lng.toFixed(5))
    }
    console.log(NEW_LOCATION);
    // this.viewCtrl.dismiss({ NEW_LOCATION: this.NEW_SELECTED_LOCATION })
    this.viewCtrl.dismiss({ NEW_LOCATION: NEW_LOCATION })
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) });
  }

  cancelLocation() {
    this.viewCtrl.dismiss({ NEW_LOCATION: this.CURRENT_LOCATION })
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) });
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
