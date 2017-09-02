import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage {
  TABLES: string[] = ['TB1','TB2','TB3',
  'TB4', 'TB5','TB6',]; 
  TABLE: string = 'TB1';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
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
