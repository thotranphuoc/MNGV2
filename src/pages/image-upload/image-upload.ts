import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams,
  ViewController
} from 'ionic-angular';

import { ImageService } from '../../services/image.service';
import { DbService } from '../../services/db.service';
import { CrudService } from '../../services/crud.service';
import { LocalService } from '../../services/local.service';
import { iImage } from '../../interfaces/image.interface';
@IonicPage()
@Component({
  selector: 'page-image-upload',
  templateUrl: 'image-upload.html',
})
export class ImageUploadPage {
  data: any;
  ACTION: string = 'New Image';
  IMAGE: iImage = null;
  isNEW: boolean = false;
  isNEW2Update: boolean = false;
  KEY: string = null;

  // base64Images: string[] = [];
  // base64ImagesThumbnail: string[] = [];
  imageURL: any = null;
  thumbnailURL: any = null;

  // newPhoto: boolean = false;
  // image = { IMG_KEYWORD: null }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private imageService: ImageService,
    private dbService: DbService,
    private crudService: CrudService,
    private localService: LocalService
  ) {
    this.data = this.navParams.data;
    this.ACTION = this.data.ACTION;
    this.IMAGE = typeof (this.data.IMAGE) === 'undefined' ? null : this.data.IMAGE;
    this.KEY = typeof (this.data.KEY) === 'undefined' ? null : this.data.KEY;
    if (!this.IMAGE || !this.KEY) {
      this.IMAGE = this.localService.IMAGE_DEFAULT;
      this.isNEW = true;
    }
    // this.base64Images = this.data.PHOTOS;
    console.log(this.data, this.ACTION, this.IMAGE, this.KEY);
    // if (typeof (this.base64Images) === 'undefined') {
    //   this.base64Images = [];
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosTakePage');
  }

  takePhoto() {
    this.selectPhotoByBrowser();
  }

  selectPhotoByBrowser() {
    console.log('start browsering or taking photo camera')
    document.getElementById('inputFile').click();
  }

  takePictureAndResizeByBrowser(event) {
    // this.base64ImagesThumbnail = [];
    // this.base64Images = [];
    // FOR THUMBNAIL
    let pro1 = this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrlsSizeSetable(event, 150, 150)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          // this.base64ImagesThumbnail = imgDataUrls;
          this.IMAGE.THUM_URL = imgDataUrls[0];
        }, 2000)
      })
      .catch((err) => console.log(err))

    // FOR NORMAL IMG
    let pro2 = this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrlsSizeSetable(event, 750, 750)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          // this.base64Images = imgDataUrls;
          this.IMAGE.IMG_URL = imgDataUrls[0];
        }, 2000)
      })
      .catch((err) => console.log(err))
    Promise.all([pro1, pro2]).then(() => {
      this.isNEW2Update = true;
    })
      .catch((err) => {
        console.log(err);
        this.isNEW2Update = false;
      })
  }


  doCancel() {
    this.dismiss(true, this.IMAGE);
  }

  startUploadUpdate() {
    console.log(this.IMAGE);
    if (!this.IMAGE.IMG_KEYWORD || !this.IMAGE.IMG_URL || !this.IMAGE.THUM_URL) {
      console.log('Info missing');
      alert('Information missing');
    } else {
      console.log('full filled');
      let pre = this.IMAGE.IMG_URL.substr(0, 4);
      if (pre === 'data') {
        console.log('new image to upload');
        this.uploadImage(this.KEY);
      }
    }
  }

  startUploadNew() {
    if (!this.IMAGE.IMG_KEYWORD || !this.IMAGE.IMG_URL || !this.IMAGE.THUM_URL) {
      console.log('Info missing');
      alert('Information missing');
    } else {
      console.log('full filled');
      this.createImage();
    }
  }

  createImage() {
    console.log(this.imageURL, this.thumbnailURL);
    let IMAGE = {
      IMG_URL: this.imageURL,
      THUM_URL: this.thumbnailURL,
      IMG_KEYWORD: this.IMAGE.IMG_KEYWORD
    }
    this.crudService.createImage(IMAGE)
      .then((res) => {
        console.log(res);
        let KEY = res.key;
        // alert('database update done');
        this.uploadImage(KEY);
      })
      .catch((err) => { console.log(err); });
  }

  uploadImage(KEY) {
    let PATH = 'SharedImages';
    // let IMAGE = this.base64Images[0];
    let IMAGE = this.IMAGE.IMG_URL;
    let PATH_THUM = 'ThumbImages'
    // let THUMBNAIL = this.base64ImagesThumbnail[0];
    let THUMBNAIL = this.IMAGE.THUM_URL;
    // let NAME = Date.now().toString();
    let pro1 = this.dbService.uploadBase64Image2FBReturnPromiseWithURL(PATH, IMAGE, KEY)
      .then((res: any) => {
        console.log(res);
        this.imageURL = res;
      })
      .catch((err) => { console.log(err); });
    let pro2 = this.dbService.uploadBase64Image2FBReturnPromiseWithURL(PATH_THUM, THUMBNAIL, KEY)
      .then((res1) => {
        console.log(res1);
        this.thumbnailURL = res1;
      })
      .catch((err) => { console.log(err); });

    return Promise.all([pro1, pro2])
      .then((res) => {
        console.log('images uploaded successfully');
        this.updateDB(KEY);
      })
      .catch((err) => {
        console.log('Something went wrong', err);
      })
  }

  updateDB(KEY) {
    // start update database
    console.log(this.imageURL, this.thumbnailURL);
    let IMAGE = {
      IMG_URL: this.imageURL,
      THUM_URL: this.thumbnailURL,
      IMG_KEYWORD: this.IMAGE.IMG_KEYWORD
    }
    this.crudService.updateImage(IMAGE, KEY)
      .then((res) => {
        console.log(res);
        this.dismiss(false, IMAGE);
        alert('database update done');

      })
      .catch((err) => { console.log(err); });
  }

  dismiss(isCancel, IMAGE) {
    this.viewCtrl.dismiss({ isCancel: isCancel, IMAGE: IMAGE })
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) })
  }


}

// export interface iImage {
//   IMG_URL: string,
//   THUM_URL: string,
//   IMG_KEYWORD: string
// }
