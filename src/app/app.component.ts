import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireService } from '../services/af.service';
import { DbService } from '../services/db.service';
import { LocalService } from '../services/local.service';
import { iProfile } from '../interfaces/profile.interface';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';
  pages: Array<{title: string, component: string, icon: string}>;
  pages1: Array<{title: string, component: string, icon: string}>;
  pages2: Array<{title: string, component: string, icon: string}>;
  isAdminOfApp: boolean = false;
  PROFILE: iProfile;
  USER = null;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private dbService: DbService,
    private localService: LocalService,
    private afService: AngularFireService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage', icon:'home' },
      { title: 'Setting', component: 'SettingPage', icon:'cog' },
      { title: 'Search', component: 'SearchPage', icon:'search' },
      { title: 'About', component: 'AboutPage', icon:'information-circle' },
      { title: 'Shop2', component: 'Shop2Page', icon:'information-circle' },
    ];

    this.pages1 = [
      { title: 'Order', component: 'OrderPage', icon:'cart' },
    ]

    this.pages2 = [
      { title: 'Admin', component: 'AdminPage', icon:'paw' },
      { title: 'Issue', component: 'TrackPage', icon: 'bug' },
    ]
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


  ionOpen() {
    console.log('Menu is opened')
    this.USER = this.afService.getAuth().auth.currentUser;
        if(this.USER){
          let USER_ID = this.USER.uid;
          this.dbService.getOneItemReturnPromise('UserProfiles/'+USER_ID).then((profile: iProfile)=>{
            this.PROFILE = profile;
            this.localService.PROFILE = profile;
            console.log(this.PROFILE);
          })
          this.dbService.checkIfUserIsAdmin(USER_ID).then((res:boolean)=>{
            this.isAdminOfApp = res;
          })
        }else{
          this.PROFILE = null;
        }
  }
}
