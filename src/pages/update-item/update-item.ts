import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
// import { ImageService } from '../../services/image.service';
import { DbService } from '../../services/db.service';
// import { AppService } from '../../services/app.service';
import { CrudService } from '../../services/crud.service';
import { iItem } from '../../interfaces/item.interface';
@IonicPage()
@Component({
  selector: 'page-update-item',
  templateUrl: 'update-item.html',
})
export class UpdateItemPage {
  data: any;
  isIMGShared: boolean = false;
  willIMGBeUploaded: boolean = false;
  SHOP_ITEM: iItem = null;
  base64Images: any[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    // private imageService: ImageService,
    private dbService: DbService,
    private crudService: CrudService,
    // private appService: AppService
  ) {
    this.data = this.navParams.data;
    this.SHOP_ITEM = this.data.SHOP_ITEM;
    if (typeof (this.SHOP_ITEM) === 'undefined') {
      this.SHOP_ITEM = null;
      this.navCtrl.setRoot('HomePage');
    } else {
      console.log(this.SHOP_ITEM);
      this.checkIfImageShare(this.SHOP_ITEM.ITEM_IMAGES[0]);
      this.base64Images = this.SHOP_ITEM.ITEM_IMAGES;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateItemPage');
  }

  clickImage(image, i) {
    console.log(image, i)
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Take a photo',
          handler: () => {
            console.log('Update photo clicked');
            // this.takePhoto(image);
            this.takePhoto();
          }
        },
        {
          text: 'Select a photo',
          handler: () => {
            console.log('Update photo clicked');
            // this.takePhoto(image);
            this.selectPhoto();
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
    actionSheet.present()
    .catch((err)=>{ console.log(err)})
  }

  takePhoto() {
    console.log('takePhoto');
    let photosModal = this.modalCtrl.create('PhotoTakePage', { PHOTOS: this.base64Images });
    photosModal.onDidDismiss((data) => {
      console.log(data);
      if (!data.isCancel) {
        this.base64Images = data.PHOTOS;
        this.SHOP_ITEM.ITEM_IMG_SHARED = false;
        this.willIMGBeUploaded = true;
        this.updatePhoto(data.PHOTOS);
      } else {
        console.log('cancel: do nothing');
      }

    });
    photosModal.present()
    .then((res)=>{ console.log(res)})
    .catch((err)=>{ console.log(err)})
  }

  selectPhoto() {
    console.log('selectPhoto');
    let photosModal1 = this.modalCtrl.create('PhotoSelectPage', { KEY: this.SHOP_ITEM.ITEM_NAME_EN, PHOTOS: this.base64Images });
    photosModal1.onDidDismiss((data1) => {
      console.log(data1);
      if (!data1.isCancel) {
        this.base64Images = data1.PHOTOS;
        this.SHOP_ITEM.ITEM_IMG_SHARED = true;
        this.willIMGBeUploaded = false;
        this.updatePhoto(data1.PHOTOS);
      } else {
        console.log('do nothing')
      }

    });
    photosModal1.present()
    .then((res)=>{ console.log(res)})
    .catch((err)=>{ console.log(err)})
  }

  updatePhoto(PHOTOS: string[]) {
    console.log(this.willIMGBeUploaded, this.isIMGShared, PHOTOS);
    if (this.willIMGBeUploaded) {
      let NAME = new Date().getTime().toString();
      this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('ItemImages/' + this.SHOP_ITEM.ITEM_ID, PHOTOS, NAME)
        .then((urls) => {
          // update ITEM_IMAGES then delete the old ITEM_IMAGE
          this.dbService.updateAnObjectAtNode('Items/' + this.SHOP_ITEM.ITEM_ID + '/ITEM_IMAGES', urls);
          if (this.isIMGShared) {
            this.SHOP_ITEM.ITEM_IMAGES = urls;
          } else {
            // delete exist images in firebase storage
            this.dbService.deleteFileFromFireStorageWithHttpsURL(this.SHOP_ITEM.ITEM_IMAGES[0])
              .then((res) => {
                this.SHOP_ITEM.ITEM_IMAGES = urls;
              })
              .catch((err) => { console.log(err) });
          }
        })
        .catch((err) => { console.log(err) });
    } else {
      if (this.isIMGShared) {
        this.SHOP_ITEM.ITEM_IMAGES = PHOTOS;
        // update ITEM_IMAGES then delete the old ITEM_IMAGE
        this.dbService.updateAnObjectAtNode('Items/' + this.SHOP_ITEM.ITEM_ID + '/ITEM_IMAGES', PHOTOS)
          .then((res) => { console.log(res) })
          .catch((err) => { console.log(err) })
      } else {
        // delete exist images in firebase storage
        this.dbService.deleteFileFromFireStorageWithHttpsURL(this.SHOP_ITEM.ITEM_IMAGES[0])
          .then((res) => {
            this.SHOP_ITEM.ITEM_IMAGES = PHOTOS;
            // update ITEM_IMAGES then delete the old ITEM_IMAGE
            this.dbService.updateAnObjectAtNode('Items/' + this.SHOP_ITEM.ITEM_ID + '/ITEM_IMAGES', PHOTOS)
              .then((res) => { console.log(res) })
              .catch((err) => { console.log(err) })
          })
          .catch((err) => { console.log(err) });
      }
    }
  }

  update() {
    console.log(this.SHOP_ITEM);
    this.crudService.updateItem(this.SHOP_ITEM);
  }

  checkIfImageShare(IMG_URL) {
    let searchStr = 'menugo'
    let index = this.SHOP_ITEM.ITEM_IMAGES[0].toLocaleLowerCase().indexOf(searchStr);
    if (index >= 0) {
      this.isIMGShared = false;
    } else {
      this.isIMGShared = true;
    }
    // let stringd = this.SHOP_ITEM.ITEM_IMAGES[0].substr(8, 15);
    // console.log(stringd);
    // if (stringd === 'firebasestorage') {
    //   this.isIMGShared = false;
    // } else {
    //   this.isIMGShared = true;
    // }
  }

}
