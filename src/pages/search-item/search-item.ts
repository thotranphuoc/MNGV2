import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import {
  AngularFireDatabase,
  // FirebaseListObservable, 
  // FirebaseObjectObservable 
} from 'angularfire2/database';
import { AppService } from '../../services/app.service';
import { iItem } from '../../interfaces/item.interface';
@IonicPage()
@Component({
  selector: 'page-search-item',
  templateUrl: 'search-item.html',
})
export class SearchItemPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private afDB: AngularFireDatabase,
    private appService: AppService
  ) {
  }
  srcStr: string = '';
  itemList: iItem[] = [];
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchItemPage');
  }

  getItems(event) {
    console.log(event.srcElement.value);
    if (typeof (event.srcElement.value) != 'undefined') {
      this.srcStr = event.srcElement.value.trim();
      if (this.srcStr) {
        this.searchString(this.srcStr);
      } else {
        console.log('no string')
        this.itemList = [];
      }
    } else {
      this.itemList = [];
    }
  }

  searchString(searchStr: string) {
    this.itemList = [];
    this.afDB.list('Items/').forEach((items: iItem[]) => {
      this.itemList = items.filter(item => item.ITEM_NAME_EN.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase()) >= 0 || item.ITEM_NAME_LOCAL.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase()) >= 0);
      console.log(this.itemList);
    })
      .then(() => {
        console.log(this.itemList);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  selectItem(item: iItem) {
    console.log(item);
    this.viewCtrl.dismiss({
      ITEM: item
    })
      .then((res) => { console.log(res); })
      .catch((err) => { console.log(err); });
  }

  close() {
    this.viewCtrl.dismiss()
      .then((res) => { console.log(res); })
      .catch((err) => { console.log(err); });
  }

}
