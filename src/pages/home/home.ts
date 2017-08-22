import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { iPosition } from '../../interfaces/position.interface';
import { Geolocation } from '@ionic-native/geolocation';
import { AppService } from '../../services/app.service';
import { LocalService } from '../../services/local.service';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  USER_LOCATION: iPosition;
  USER_LAST_TIME: string;
  USER_ID = null;
  IMG = '../../assets/imgs/menugo_192x192.png';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private afAuth: AngularFireAuth,
    private geolocation: Geolocation,
    private appService: AppService,
    private localService: LocalService
  ) {
    // this.test();
    if (this.afAuth.auth.currentUser) {
      this.USER_ID = this.afAuth.auth.currentUser.uid;
    }
    this.geolocation.getCurrentPosition()
      .then((res) => {
        console.log(res);
        this.USER_LOCATION = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
        this.getShopsNearby(this.USER_LOCATION.lat, this.USER_LOCATION.lng);
      })
      .catch((err) => {
        console.log(err);
        if (this.USER_ID) {
          let UID = this.USER_ID;
          this.dbService.getOneItemReturnPromise('UserPosition/' + UID).then((res: any) => {
            this.USER_LOCATION = res.LAST_POSITION;
            this.USER_LAST_TIME = res.TIME;
            console.log(res);
            this.getShopsNearby(this.USER_LOCATION.lat, this.USER_LOCATION.lng);
          })
            .catch((err) => {
              this.USER_LOCATION = { lat: 10.778168043677463, lng: 106.69638633728027 };
              this.getShopsNearby(this.USER_LOCATION.lat, this.USER_LOCATION.lng);
            })
        }
      })
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  go2MapPage() {
    this.navCtrl.setRoot('MapPage', { LOC: this.USER_LOCATION });
  }

  getShopsNearby(LAT: number, LNG: number) {
    let latArray: any[] = [];
    let lngArray: any[] = [];
    let itemArray: any[] = [];
    let db = firebase.database();
    const loca = db.ref('ShopsLOCATION');
    const query1 = loca
      .orderByChild('lat')
      .startAt(LAT - 0.1)
      .endAt(LAT + 0.1)
    let pro1 = query1.once('value', snap => {
      console.log(snap);
      snap.forEach((child: any) => {
        console.log(child.val(), child.key)
        latArray.push(child.key);
        itemArray.push(child.val());
        return false
      })
    })

    const query2 = loca
      .orderByChild('lng')
      .startAt(LNG - 0.1)
      .endAt(LNG + 0.2)
    let pro2 = query2.once('value', snap => {
      console.log(snap);
      snap.forEach((child: any) => {
        console.log(child.val(), child.key)
        lngArray.push(child.key);
        return false
      })
    })

    Promise.all([pro1, pro2]).then(() => {
      let final = this.appService.commonOf2Arrays(latArray, lngArray);
      console.log(final);
      this.localService.SHOPs_NEARBY = final;
      let finalLOC = [];
      final.forEach(ID=>{
        let index = latArray.indexOf(ID);
        finalLOC.push(itemArray[index]);
      })
      this.localService.SHOPs_LOCATION = finalLOC;
      console.log(finalLOC);
      this.localService.shopsLoaded = true;
    })
  }

}


