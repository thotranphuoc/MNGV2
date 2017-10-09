import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GmapService } from '../services/gmap.service';
import { GchartService } from '../services/gchart.service';
import { CrudService } from '../services/crud.service';
import { AngularFireService } from '../services/af.service';
import { DbService } from '../services/db.service';
import { ImageService } from '../services/image.service';
import { LocalService } from '../services/local.service';
import { AuthService } from '../services/auth.service';
import { AppService } from '../services/app.service';
import { ShopService } from '../services/shop.service';
import { StatisticService } from '../services/statistic.service';
import { ClipboardService } from '../services/clipboard.service';
// setup angularfire2
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';

export const firebaseConfig = {
    apiKey: "AIzaSyC4NxrYYEzopXAcKvDQFE0vqlIY17w2YMg",
    authDomain: "menugo-9df18.firebaseapp.com",
    databaseURL: "https://menugo-9df18.firebaseio.com",
    projectId: "menugo-9df18",
    storageBucket: "menugo-9df18.appspot.com",
    messagingSenderId: "230502880389"
  };


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    GmapService,
    GchartService,
    AngularFireService,
    DbService,
    ImageService,
    LocalService,
    AuthService,
    AppService,
    ShopService,
    StatisticService,
    CrudService,
    ClipboardService,
    AngularFireAuth
  ]
})
export class AppModule {}
