import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';
@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage {
  TABLES: string[] = ['TB1','TB2','TB3',
  'TB4', 'TB5','TB6',]; 
  TABLE: string = 'TB1';
  data: any;
  SHOP: iShop;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.data = this.navParams.data;
    console.log(this.data);
    this.SHOP = this.data.SHOP;
    this.TABLES = this.SHOP.SHOP_TABLES;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TablePage');
  }

  closeModal(){
    this.viewCtrl.dismiss({TABLE: this.TABLE});
  }

  selectTable(table){
    this.TABLE = table;
    this.closeModal();
  }

}
