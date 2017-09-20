import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, 
  // ViewController, 
  ActionSheetController, AlertController } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';
import { LocalService } from '../../services/local.service';
import { ImageService } from '../../services/image.service';
import { CrudService } from '../../services/crud.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';

@IonicPage()
@Component({
  selector: 'page-shop-add-new',
  templateUrl: 'shop-add-new.html',
})
export class ShopAddNewPage {
  SHOP: iShop = null;
  base64Images: string[] = [];
  isKindSet: boolean = false;
  // Review & post
  isInfoFullFilled: boolean = true;
  hasPosted: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    // private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private localService: LocalService,
    private imageService: ImageService,
    private crudService: CrudService,
    private afService: AngularFireService,
    private appService: AppService,
  ) {
    this.SHOP = this.localService.SHOP_DEFAULT;
    console.log(this.SHOP);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopAddNewPage');
  }

  updateLocation() {
    let mapModal = this.modalCtrl.create('LocationPage', { CURRENT_LOCATION: this.SHOP.SHOP_LOCATION });
    mapModal.onDidDismiss(data => {
      console.log(data);
      this.SHOP.SHOP_LOCATION = data.NEW_LOCATION;
    })
    mapModal.present();
  }

  takePhotos() {
    console.log('takePhotos');
    this.selectPhotosByBrowser();
  }

  selectPhotosByBrowser() {
    console.log('selectPhotosByBrowser');
    document.getElementById('inputFile').click();
  }

  takePictureAndResizeByBrowser(event) {
    this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          this.base64Images = typeof (this.base64Images) !== 'undefined' ? this.base64Images.concat(imgDataUrls) : imgDataUrls;
        }, 1000);
      })
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

  removePhoto(image, i) {
    this.base64Images.splice(i, 1);
  }

  createShop() {
    console.log(this.SHOP);
    console.log(this.base64Images);
    this.checkInfoFullFilled();
    if (this.isInfoFullFilled) {
      if (this.afService.getAuth().auth.currentUser) {
        // user signed in
        this.SHOP.SHOP_OWNER = this.afService.getAuth().auth.currentUser.uid;
        this.SHOP.SHOP_DATE_CREATE = this.appService.getCurrentDataAndTime().toString();
        console.log(this.SHOP);
        this.crudService.createNewShop(this.SHOP, this.base64Images)
          .then((res) => {
            console.log('success', res);
            this.SHOP = this.localService.SHOP_DEFAULT;
            this.appService.toastMsg('Success!', 5000);
          })
          .catch((err) => {
            console.log('error', err);
          })
      } else {
        // user not signed in yet
        this.hasPosted = false;
        this.alertMsgWithConfirmationToGoToPage();
      }
    } else {
      this.appService.alertMsg('Error', 'info not full filled')
    }
  }

  checkInfoFullFilled() {

    this.isInfoFullFilled = true;
    if (this.SHOP.SHOP_NAME === null || this.SHOP.SHOP_NAME == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_NAME, ' shop name is missed');
    }
    if (this.SHOP.SHOP_ADDRESS === null || this.SHOP.SHOP_ADDRESS == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_ADDRESS, ' address is missed');
    }

    if (this.SHOP.SHOP_PHONE === null || this.SHOP.SHOP_PHONE == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_PHONE, ' phone is missed');
    }

    if (this.SHOP.SHOP_CURRENCY === null || this.SHOP.SHOP_CURRENCY == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_CURRENCY, ' currency is missed');
    }

    if (this.SHOP.SHOP_KIND === null || this.SHOP.SHOP_KIND == '') {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_KIND, ' kind is missed');
    }

    if (this.SHOP.SHOP_LOCATION === null) {
      this.isInfoFullFilled = false;
      console.log(this.SHOP.SHOP_LOCATION, ' location is missed');
    }

    if (this.base64Images.length == 0) {
      this.isInfoFullFilled = false;
      console.log('images is missed');
    }
    console.log(this.isInfoFullFilled, '<--isInfoFullfilled?');
  }

  alertMsgWithConfirmationToGoToPage() {
    this.alertCtrl.create({
      title: 'Not Signed',
      message: 'Plz login to continue',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('go to Account page to login ');
            // this.navCtrl.popToRoot();
            this.navCtrl.push('AccountPage', { action: 'request-login' });
          }
        }
      ]
    }).present();
  }

  selectKind(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select one',
      buttons: [
        {
          text: 'Cafe Shop',
          handler: () => {
            console.log('Coffee clicked');
            this.setKind('Cafe Shop');
          }
        },
        {
          text: 'Restaurant',
          handler: () => {
            console.log('Restaurant clicked');
            this.setKind('Restaurant');
          }
        },
        {
          text: 'Take Away',
          handler: () => {
            console.log('Take Away clicked');
            this.setKind('Take Away');
          }
        },
        {
          text: 'Home Made',
          handler: () => {
            console.log('Home made clicked');
            this.setKind('Home Made');
          }
        },
        {
          text: 'Other',
          handler: () => {
            console.log('Other clicked');
            this.setKind('Other');
          }
        },{
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

  setKind(KIND){
    this.isKindSet = true;
    this.SHOP.SHOP_KIND = KIND;
    console.log(KIND);
  }

}
