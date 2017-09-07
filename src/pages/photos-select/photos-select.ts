import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-photos-select',
  templateUrl: 'photos-select.html',
})
export class PhotosSelectPage {
  data: any;
  base64Images: string[] = [];
  images: string[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private viewCtrl: ViewController,
    private afDB: AngularFireDatabase) {
    this.data = this.navParams.data;
    this.base64Images = this.data.PHOTOS;
    console.log(this.data);
    if (typeof (this.base64Images) === 'undefined') {
      this.base64Images = [];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosSelectPage');
  }

  getItems(event) {
    console.log(event.srcElement.value);
    let srcStr = null;
    if (typeof (event.srcElement.value) != 'undefined') {
      let srcStr = event.srcElement.value.trim();
      if (srcStr) {
        this.searchString(srcStr);
      } else {
        console.log('no string')
        this.images = [];
      }
    } else {
      this.images = [];
    }
  }

  searchString(searchStr: string) {
    console.log(searchStr);
    this.images = [];
    this.afDB.list('Images/').forEach((images: any[])=>{
      this.images = images.filter(image => image.IMG_NAME.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase())>=0);
      console.log(this.images);
    })
  }

  selectPhoto(image){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Select',
          handler: () => {
            this.viewCtrl.dismiss({ isCancel: false, PHOTOS: [image.IMG_URL]});
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  closeModal(){
    this.viewCtrl.dismiss({ isCancel: true, PHOTOS: this.base64Images});
  }

}
