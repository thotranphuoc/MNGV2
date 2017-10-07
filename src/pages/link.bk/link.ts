import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LinkPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
  name: 'link-page',
  segment: 'detail/:id',
  // defaultHistory:['link-page']
})
@Component({
  selector: 'page-link',
  templateUrl: 'link.html',
})
export class LinkPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let id = this.navParams.get('id');
    console.log('id: ', id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinkPage');
  }

}
