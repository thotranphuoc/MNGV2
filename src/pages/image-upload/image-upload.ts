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
  // isNEW2Update: boolean = false;
  isUpdatedDone: boolean = true;
  IMG_KEY: string = null;
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
    this.IMG_KEY = typeof (this.data.KEY) === 'undefined' ? null : this.data.KEY;

    if (!this.IMAGE || !this.IMG_KEY) {
      this.IMAGE = this.localService.IMAGE_DEFAULT;
      this.isNEW = true;
    }
    console.log(this.data, this.ACTION, this.IMAGE, this.IMG_KEY);
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
    // FOR THUMBNAIL
    let pro1 = this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrlsSizeSetable(event, 150, 150)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          this.IMAGE.THUM_URL = imgDataUrls[0];
        }, 2000)
      })
      .catch((err) => console.log(err))

    // FOR NORMAL IMG
    let pro2 = this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrlsSizeSetable(event, 750, 750)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          this.IMAGE.IMG_URL = imgDataUrls[0];
        }, 2000)
      })
      .catch((err) => console.log(err))
    Promise.all([pro1, pro2]).then((res) => {
      // this.isNEW2Update = true;
      console.log(res);
    })
      .catch((err) => {
        console.log(err);
        // this.isNEW2Update = false;
      })
  }

  doCancel() {
    this.dismiss(true, this.IMAGE);
  }

  // ADD NEW
  startUploadNew() {
    if (!this.IMAGE.IMG_KEYWORD || !this.IMAGE.IMG_URL || !this.IMAGE.THUM_URL) {
      console.log('Info missing');
      alert('Information missing');
    } else {
      this.isUpdatedDone = false;
      console.log('full filled');
      this.createImage();
    }
  }

  createImage() {
    console.log(this.IMAGE.IMG_URL, this.IMAGE.THUM_URL);
    let IMAGE = {
      IMG_URL: this.IMAGE.IMG_URL,
      THUM_URL: this.IMAGE.THUM_URL,
      IMG_KEYWORD: this.IMAGE.IMG_KEYWORD
    };
    if (!IMAGE.IMG_KEYWORD || !IMAGE.IMG_URL || !IMAGE.THUM_URL) {
      console.log('Info missing');
      alert('Information missing');
    } else {
      this.crudService.createImage(IMAGE)
        .then((res) => {
          console.log(res);
          let IMG_KEY = res.key;
          this.uploadImage(IMG_KEY)
            .then((res1) => {
              console.log(res1);
              this.updateDB(IMG_KEY);
            })
            .catch((err1) => { console.log(err1) });
        })
        .catch((err) => { console.log(err); });
    }
  }

  // UPDATE EXISTING
  startUploadUpdate() {
    console.log(this.IMAGE);
    if (!this.IMAGE.IMG_KEYWORD || !this.IMAGE.IMG_URL || !this.IMAGE.THUM_URL) {
      console.log('Info missing');
      alert('Information missing');
    } else {
      this.isUpdatedDone = false;
      console.log('full filled');
      let pre = this.IMAGE.IMG_URL.substr(0, 4);

      // if IMAGE.IMG_URL is new captured like: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…pCig0R47SRkAEfkdc1
      if (pre === 'data') {
        console.log('new image to upload');
        this.uploadImage(this.IMG_KEY)
          .then((res1) => {
            console.log(res1);
            this.updateDB(this.IMG_KEY);
          })
      } else {
        this.updateDB(this.IMG_KEY);
      }
    }
  }

  uploadImage(IMG_KEY) {
    let PATH = 'SharedImages';
    let IMAGE = this.IMAGE.IMG_URL;
    let PATH_THUM = 'ThumbImages'
    let THUMBNAIL = this.IMAGE.THUM_URL;
    let pro1 = this.dbService.uploadBase64Image2FBReturnPromiseWithURL(PATH, IMAGE, IMG_KEY)
      .then((res: any) => {
        console.log(res);
        this.IMAGE.IMG_URL = res;
      })
      .catch((err) => { console.log(err); });
    let pro2 = this.dbService.uploadBase64Image2FBReturnPromiseWithURL(PATH_THUM, THUMBNAIL, IMG_KEY)
      .then((res1: any) => {
        console.log(res1);
        this.IMAGE.THUM_URL = res1;
      })
      .catch((err) => { console.log(err); });

    return Promise.all([pro1, pro2])
  }

  updateDB(IMG_KEY) {
    console.log(this.IMAGE.IMG_URL, this.IMAGE.THUM_URL);
    let IMAGE = {
      IMG_URL: this.IMAGE.IMG_URL,
      THUM_URL: this.IMAGE.THUM_URL,
      IMG_KEYWORD: this.IMAGE.IMG_KEYWORD
    }
    this.crudService.updateImage(IMAGE, IMG_KEY)
      .then((res) => {
        this.isUpdatedDone = true;
        console.log(res);
        this.navCtrl.pop();
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

