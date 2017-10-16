import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
// import { ImageService } from '../../services/image.service';
import { DbService } from '../../services/db.service';
// import { AppService } from '../../services/app.service';
import { CrudService } from '../../services/crud.service';
import { iItem } from '../../interfaces/item.interface';
import { iShop } from '../../interfaces/shop.interface';
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
  SHOP: iShop = null;
  base64Images: any[];
  CATEGORIES: string[];
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
    console.log(this.data);
    if (typeof (this.data.SHOP_ITEM) === 'undefined') {
      this.SHOP_ITEM = null;
      this.navCtrl.setRoot('HomePage');
    } else {
      this.SHOP_ITEM = this.data.SHOP_ITEM;
      this.SHOP = this.data.SHOP;
      this.CATEGORIES = this.SHOP.SHOP_CATEGORIES;
      // console.log(this.data);
      if (this.SHOP_ITEM.ITEM_IMAGES) {
        this.checkIfImageShare(this.SHOP_ITEM.ITEM_IMAGES[0]);
      }
      this.base64Images = this.SHOP_ITEM.ITEM_IMAGES;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateItemPage');
  }

  clickImage() {
    // console.log(image, i)
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
      .catch((err) => { console.log(err) })
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
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) })
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
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) })
  }

  // NOTE
  // Nếu có take photo -> willIMGBeUploaded = true,
  // Nếu img url đang share -> chỉ update url, nếu img url không share, sẽ delete image cũ

  updatePhoto(PHOTOS: string[]) {
    console.log(this.willIMGBeUploaded, this.isIMGShared, PHOTOS);
    if (this.willIMGBeUploaded) {
      // let NAME = new Date().getTime().toString();
      let NAME = this.SHOP_ITEM.ITEM_ID
      console.log(PHOTOS);
      this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('ItemImages/' + this.SHOP_ITEM.ITEM_ID, PHOTOS, NAME)
        .then((urls) => {
          // update ITEM_IMAGES then delete the old ITEM_IMAGE
          this.SHOP_ITEM['IMAGES']= urls;
          this.SHOP_ITEM['ITEM_IMG_SHARED']=false;
          // this.dbService.updateAnObjectAtNode('Items/' + this.SHOP_ITEM.ITEM_ID + '/ITEM_IMAGES', urls);
          this.dbService.updateAnObjectAtNode('Items/' + this.SHOP_ITEM.ITEM_ID , this.SHOP_ITEM).then((res)=>{
            this.SHOP_ITEM.ITEM_IMAGES = urls;
            this.isIMGShared = false;
          }).catch((err)=>{
            console.log(err);
          })
          
          // if (this.isIMGShared) {
          //   this.SHOP_ITEM.ITEM_IMAGES = urls;
          // } else {
          //   // delete exist images in firebase storage
          //   if(this.SHOP_ITEM.ITEM_IMAGES){
          //     this.dbService.deleteFilesFromFireStorageWithHttpsURL(this.SHOP_ITEM.ITEM_IMAGES)
          //     .then((res) => {
          //       this.SHOP_ITEM.ITEM_IMAGES = urls;
          //     })
          //     .catch((err) => { 
          //       console.log(err); 
          //       this.SHOP_ITEM.ITEM_IMAGES = urls;
          //     });
          //   }else{
          //     this.SHOP_ITEM['ITEM_IMAGES'] = urls;
          //   }
          // }
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
        this.dbService.deleteFilesFromFireStorageWithHttpsURL(this.SHOP_ITEM.ITEM_IMAGES)
          .then((res) => {
            this.SHOP_ITEM.ITEM_IMAGES = PHOTOS;
            // update ITEM_IMAGES then delete the old ITEM_IMAGE
            this.dbService.updateAnObjectAtNode('Items/' + this.SHOP_ITEM.ITEM_ID + '/ITEM_IMAGES', PHOTOS)
              .then((res) => { console.log(res) })
              .catch((err) => { console.log(err) })
          })
          .catch((err) => {
            console.log(err);
            this.SHOP_ITEM.ITEM_IMAGES = PHOTOS;
            this.dbService.updateAnObjectAtNode('Items/' + this.SHOP_ITEM.ITEM_ID + '/ITEM_IMAGES', PHOTOS)
              .then((res) => { console.log(res) })
              .catch((err) => { console.log(err) })
          });
      }
    }
  }

  update() {
    console.log(this.SHOP_ITEM);
    this.crudService.updateItem(this.SHOP_ITEM);
    this.navCtrl.pop();
  }

  cancel(){
    this.navCtrl.pop();
  }

  checkIfImageShare(IMG_URL: string) {
    let searchStr = 'Item';
    let index = IMG_URL.indexOf(searchStr);
    console.log(searchStr, IMG_URL, index);
    if (index >= 0) {
      this.isIMGShared = false;
      console.log('isIMGShared = false');
    } else {
      this.isIMGShared = true;
      console.log('isIMGShared = true')
    }
  }

  setCategory() {
    console.log('Set Category');
  }

  // deleteImages() {
  //   console.log(this.SHOP_ITEM.ITEM_IMAGES);
  //   this.dbService.deleteFilesFromFireStorageWithHttpsURL(this.SHOP_ITEM.ITEM_IMAGES)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }

}
