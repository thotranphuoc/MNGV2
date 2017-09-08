import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, ViewController, AlertController } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { ImageService } from '../../services/image.service';
import { DbService } from '../../services/db.service';
// import { LocalService } from '../../services/local.service';
import { CrudService } from '../../services/crud.service';
import { iShop } from '../../interfaces/shop.interface';
import { iProfile } from '../../interfaces/profile.interface';

@IonicPage()
@Component({
  selector: 'page-update-shop',
  templateUrl: 'update-shop.html',
})
export class UpdateShopPage {
  data: any;
  SHOP: iShop = null;
  PROFILE: iProfile;
  base64Images: any[];
  TABLES: string[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private imageService: ImageService,
    private dbService: DbService,
    private appService: AppService,
    // private localService: LocalService,
    private crudService: CrudService
  ) {
    this.data = this.navParams.data;
    this.SHOP = this.data.SHOP;
    this.PROFILE = this.data.PROFILE;
    if (typeof (this.SHOP) === 'undefined') {
      this.SHOP = null
      this.navCtrl.setRoot('HomePage');
    } else {
      this.TABLES = this.SHOP.SHOP_TABLES;
    }

    console.log(this.SHOP);
    console.log(this.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateInfoPage');
  }

  clickImage(image, i) {
    console.log(image, i)
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete this photo',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
            this.removePhoto(image, i);
          }
        }, {
          text: 'Add new photos',
          handler: () => {
            console.log('Add new clicked');
            this.takePhotos();
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

  takePhotos() {
    this.selectPhotosByBrowser();
  }

  selectPhotosByBrowser() {
    document.getElementById('inputFile').click();
  }

  takePictureAndResizeByBrowser(event) {
    this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          this.base64Images = imgDataUrls;
          let NAME = new Date().getTime().toString();
          this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('ShopImages/' + this.SHOP.SHOP_ID, this.base64Images, NAME)
            .then((urls) => {
              // add this.SHOP.SHOP_IMAGES then update to db
              this.SHOP.SHOP_IMAGES = this.SHOP.SHOP_IMAGES.concat(urls);
              this.dbService.updateAnObjectAtNode('Shops/' + this.SHOP.SHOP_ID + '/SHOP_IMAGES', this.SHOP.SHOP_IMAGES)
            })
        }, 1000);
      })
  }

  removePhoto(image, i) {
    this.SHOP.SHOP_IMAGES.splice(i, 1);
    // update db. Remember to delete removed image from firebase storage
    this.dbService.deleteFileFromFireStorageWithHttpsURL(image).then((res) => {
      console.log(res);
    }).catch((err) => console.log(err))
    this.dbService.updateAnObjectAtNode('Shops/' + this.SHOP.SHOP_ID + '/SHOP_IMAGES', this.SHOP.SHOP_IMAGES);
  }

  update() {
    this.crudService.updateShop(this.SHOP).then((res)=>{
      console.log(res);
      this.navCtrl.pop();
    }).catch((err)=>{
      console.log(err);
    })
  }

  updateLocation() {
    let mapModal = this.modalCtrl.create('LocationPage', { CURRENT_LOCATION: this.SHOP.SHOP_LOCATION });
    mapModal.onDidDismiss(data => {
      console.log(data);
      this.SHOP.SHOP_LOCATION = data.NEW_LOCATION;
    });
    mapModal.present();
  }

  editTables(table, i) {
    console.log(table);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Remove table',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
            this.removeTable(table, i);
          }
        }, {
          text: 'Add new table',
          handler: () => {
            console.log('Add new clicked');
            this.addTable();
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

  removeTable(table, i) {
    this.TABLES.splice(i, 1);
  }

  addTable() {
    let promp = this.alertCtrl.create({
      title: 'New table',
      message: 'Enter a new table you want to add',
      inputs: [
        {
          name: 'NEW_TABLE',
          placeholder: 'Title'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: (data) => {
            console.log('Saved clicked', data);
            this.addNewTable(data.NEW_TABLE);
          }
        }
      ]
    });
    promp.present();
  }

  addNewTable(table){
    let index = this.TABLES.indexOf(table);
    if(index<0){
      this.TABLES.push(table);
    }else{
      alert(table + ' already exists');
    }
  }


}
