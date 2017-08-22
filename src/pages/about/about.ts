import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  versions: any[] = [
    { VERSION: '0.2', DATE: '2017/07/15', LOCATION: 'Vientiane' },
    { VERSION: '0.4', DATE: '2017/07/23', LOCATION: 'Saigon' },
    { VERSION: '0.5', DATE: '2017/07/27', LOCATION: 'Vientiane' },
    { VERSION: '0.5.1', DATE: '2017/07/28', LOCATION: 'Vientiane' },
    { VERSION: '0.5.2', DATE: '2017/07/29', LOCATION: 'Vientiane' },
    { VERSION: '0.6', DATE: '2017/07/30', LOCATION: 'Vientiane' },
    { VERSION: '0.6.1', DATE: '2017/08/01', LOCATION: 'Vientiane' },
    { VERSION: '0.6.3', DATE: '2017/08/06', LOCATION: 'Vientiane' },
    { VERSION: '0.6.4', DATE: '2017/08/08', LOCATION: 'Vientiane' }
  ]
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private nav: Nav) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  ionViewWillEnter(){
    this.nav.swipeBackEnabled = true;
  }

  ionViewWillLeave(){
    this.nav.swipeBackEnabled = false;
  }

}
