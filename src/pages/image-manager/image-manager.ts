import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ModalController } from 'ionic-angular';

import { CrudService } from '../../services/crud.service';
import { AppService } from '../../services/app.service';
@IonicPage()
@Component({
  selector: 'page-image-manager',
  templateUrl: 'image-manager.html',
})
export class ImageManagerPage {
  IMAGE_LIST: any;
  temp_IMAGE_LIST: any;
  IMAGES: any;
  IMAGES_BK: any;
  // searchString: string;
  isSearching: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private crudService: CrudService,
    private appService: AppService
  ) {
    // this.getImages();
    this.getImagesAsync();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageManagerPage');
  }

  getImages() {
    this.crudService.getImages().then((data: any[]) => {
      console.log(data);
      this.IMAGES = [];
      // data.forEach((item: any) =>{
      //   this.IMAGES.push({ key: item.key, IMG_KEYWORD: item.data.IMG_KEYWORD, IMG_URL: item.data.IMG_URL, VISIBLE: false });
      // });
      this.IMAGES = data;
      this.IMAGES.map(image => image['VISIBLE'] = false)
      this.IMAGES_BK = this.IMAGES;
      console.log(this.IMAGES);
    })
  }

  getImagesAsync() {
    this.IMAGE_LIST = this.crudService.getImagesAsync();
  }

  doActionSheet(image, KEY) {
    console.log(image);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
        //   text: 'Delete',
        //   role: 'destructive',
        //   handler: () => {
        //     console.log('Destructive clicked');
        //     // this.crudService.deleteIssue(ISSUE.key);
        //     // let index = this.issuesData.indexOf(ISSUE);
        //     // this.issuesData.splice(index, 1);
        //   }
        // }, {
          text: 'Update',
          handler: () => {
            console.log('Change image clicked');
            this.updateImage(image, KEY);
          }
        // }, {
        //   text: 'Edit key words',
        //   handler: () => {
        //     console.log('Archive clicked');
        //     this.editImage(image, index);
        //     console.log(image);
        //   }
        }, {
          text: 'Add new',
          handler: () => {
            console.log('add new clicked');
            this.addNewImage();
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

  // editImage(image, index) {
  //   let promp = this.alertCtrl.create({
  //     title: 'Edit Key Words',
  //     // message: 'Enter a new table you want to add',
  //     inputs: [
  //       {
  //         name: 'KEY_WORDS',
  //         // placeholder: 'Title',
  //         value: image.IMG_KEYWORD
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Edit',
  //         handler: (data) => {
  //           console.log('Saved clicked', data, image);
  //           let IMAGE = {
  //             IMG_URL: image.IMG_URL,
  //             THUM_URL: image.THUM_URL,
  //             IMG_KEYWORD: data.IMG_KEYWORD
  //           }
  //           this.crudService.updateImage(IMAGE, image.$key)
  //             .then((res) => {
  //               console.log(res);
  //               alert('database update done');
  //             })
  //             .catch((err) => { console.log(err); });
  //         }
  //       }
  //     ]
  //   });
  //   promp.present();
  // }

  // saveImage(image) {
  //   console.log(image)
  // }

  addNewImage() {
    let data = {
      ACTION: 'add-new'
    }
    let modal = this.modalCtrl.create('ImageUploadPage', data);
    modal.onDidDismiss((data) => {
      console.log(data);
    })
    modal.present();
  }

  updateImage(image, Key) {
    console.log(image);
    let data = {
      ACTION: 'update-image',
      IMAGE: image,
      KEY: Key
    }

    let modal = this.modalCtrl.create('ImageUploadPage', data);
    modal.onDidDismiss((data) => {
      console.log(data);
    })
    modal.present();

  }

  getItems(event) {
    console.log(event.srcElement.value);
    // let srcStr = null;
    if (typeof (event.srcElement.value) != 'undefined') {
      let srcStr = event.srcElement.value.trim();
      if (srcStr) {
        this.searchString(srcStr);
        this.isSearching = true;
      } else {
        console.log('no string')
        // this.itemList = [];
        this.isSearching = false;
      }
    }else{
      // this.itemList = [];
      this.isSearching = false;
    }
  }

  searchString(searchStr: string) {
    this.temp_IMAGE_LIST = []
    this.IMAGE_LIST.forEach((images: any[])=>{
      this.temp_IMAGE_LIST = images.filter(image=> image.IMG_KEYWORD.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase()) >= 0);
      console.log(this.temp_IMAGE_LIST);
      
    })
  }

}
