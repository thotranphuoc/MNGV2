import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController } from 'ionic-angular';

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
  hasNewImages: boolean = false;
  // TABLES: string[] = [];
  isInfoFullFilled: boolean = true;
  ERROR: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    // private viewCtrl: ViewController,
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
    console.log('take Photo');
    let photosModal = this.modalCtrl.create('PhotoTakePage', { PHOTOS: this.base64Images });
    photosModal.onDidDismiss((data) => {
      console.log(data);
      this.base64Images = [data.PHOTOS[0]];
      this.hasNewImages = true;
      let NAME = new Date().getTime().toString();
      this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('ShopImages/' + this.SHOP.SHOP_ID, this.base64Images, NAME)
        .then((urls) => {
          // add this.SHOP.SHOP_IMAGES then update to db
          this.SHOP.SHOP_IMAGES = this.SHOP.SHOP_IMAGES.concat(urls);
          this.dbService.updateAnObjectAtNode('Shops/' + this.SHOP.SHOP_ID + '/SHOP_IMAGES', this.SHOP.SHOP_IMAGES)
        })
        .catch((err) => { console.log(err); });

    });
    photosModal.present()
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) })
  }

  removePhoto(image, i) {
    this.SHOP.SHOP_IMAGES.splice(i, 1);
    // update db. Remember to delete removed image from firebase storage
    this.dbService.deleteFileFromFireStorageWithHttpsURL(image)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err))
    this.dbService.updateAnObjectAtNode('Shops/' + this.SHOP.SHOP_ID + '/SHOP_IMAGES', this.SHOP.SHOP_IMAGES)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err))
  }

  update() {
    this.checkInfoFullFilled();
    if (this.isInfoFullFilled) {
      this.crudService.updateShop(this.SHOP)
        .then((res) => {
          console.log(res);
          this.navCtrl.pop();
        }).catch((err) => {
          console.log(err);
        })
      console.log(this.SHOP);
    } else {
      this.appService.alertMsg('Error', this.ERROR);
    }
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
    if (this.SHOP.SHOP_TABLES.length > 1) {
      this.SHOP.SHOP_TABLES.splice(i, 1);
    }
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

  addNewTable(table: string) {
    let index = this.SHOP.SHOP_TABLES.map(table => table.toLocaleLowerCase()).indexOf(table.toLocaleLowerCase())
    // let index = this.TABLES.indexOf(table);
    if (index < 0) {
      this.SHOP.SHOP_TABLES.push(table);
    } else {
      alert(table + ' already exists');
    }
  }


  editCategories(cat, i) {
    console.log(cat);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Remove category',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
            this.removeCategory(cat, i);
          }
        }, {
          text: 'Add new category',
          handler: () => {
            console.log('Add new clicked');
            this.addCategory();
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

  removeCategory(cat, i) {
    if (this.SHOP.SHOP_CATEGORIES.length > 1) {
      this.SHOP.SHOP_CATEGORIES.splice(i, 1);
    }
  }

  addCategory() {
    let promp = this.alertCtrl.create({
      title: 'New Category',
      message: 'Enter a new category you want to add',
      inputs: [
        {
          name: 'NEW_CATEGORY',
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
            this.addNewCategory(data.NEW_CATEGORY);
          }
        }
      ]
    });
    promp.present();
  }

  addNewCategory(cat: string) {
    let length = cat.trim().length;
    if (length > 0) {
      if (this.SHOP.SHOP_CATEGORIES) {
        let index = this.SHOP.SHOP_CATEGORIES.map(cat => cat.toLocaleLowerCase()).indexOf(cat.toLocaleLowerCase())
        // let index = this.TABLES.indexOf(table);
        if (index < 0) {
          this.SHOP.SHOP_CATEGORIES.push(cat);
        } else {
          alert(cat + ' already exists');
        }
      } else {
        this.SHOP['SHOP_CATEGORIES'] = [cat];
        console.log(this.SHOP);
      }
    } else {
      this.appService.alertError('Error', 'Cannot be empty');
    }
  }

  checkInfoFullFilled() {

    this.isInfoFullFilled = true;
    if (this.SHOP.SHOP_NAME === null || this.SHOP.SHOP_NAME == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_NAME, ' shop name is missed');
      this.ERROR = 'shop name is missed';
    }
    if (this.SHOP.SHOP_ADDRESS === null || this.SHOP.SHOP_ADDRESS == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_ADDRESS, ' address is missed');
      this.ERROR = ' address is missed';
    }

    if (this.SHOP.SHOP_PHONE === null || this.SHOP.SHOP_PHONE == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_PHONE, ' phone is missed');
      this.ERROR = ' phone is missed';
    }

    if (this.SHOP.SHOP_CURRENCY === null || this.SHOP.SHOP_CURRENCY == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_CURRENCY, ' currency is missed');
      this.ERROR = ' currency is missed';
    }

    if (this.SHOP.SHOP_KIND === null || this.SHOP.SHOP_KIND == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_KIND, ' kind is missed');
      this.ERROR = ' kind is missed';
    }

    if (this.SHOP.SHOP_LOCATION === null) {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_LOCATION, ' location is missed');
      this.ERROR = ' location is missed';
    }

    if (typeof (this.SHOP.SHOP_TABLES) === 'undefined' || this.SHOP.SHOP_TABLES.length < 1) {
      this.isInfoFullFilled = false;
      console.log('tables is empty');
      this.ERROR = 'Table is empty';
    }
    console.log(this.isInfoFullFilled, '<--isInfoFullfilled?');
  }
}
