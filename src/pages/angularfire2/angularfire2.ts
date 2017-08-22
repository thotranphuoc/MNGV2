import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-angularfire2',
  templateUrl: 'angularfire2.html',
})
export class Angularfire2Page {
  items: any;
  data: any;
  COLOR_NAME: string = 'yellow';
  SIZE: number = 20;
  SIZE_Str: string =  '20px';
  ACTION: string = 'SENDING';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afDB: AngularFireDatabase) {
      this.items = this.afDB.list('AngularFire2').subscribe((data)=>{
        this.data = data;
        console.log(data);
      })

      console.log(this.items)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Angularfire2Page');
  }

  increase(){
    this.SIZE ++;
    this.SIZE_Str = this.SIZE.toString() + 'px';
  }

  decrease(){
    this.SIZE --;
    this.SIZE_Str = this.SIZE.toString() + 'px';
  }

}
