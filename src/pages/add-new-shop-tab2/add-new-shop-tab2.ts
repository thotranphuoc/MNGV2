import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ImageService } from '../../services/image.service';
import { LocalService } from '../../services/local.service';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-add-new-shop-tab2',
  templateUrl: 'add-new-shop-tab2.html',
})
export class AddNewShopTab2Page {
  SHOP: iShop;
  base64Image: string;
  base64Images: string[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private imageService: ImageService,
    private localService: LocalService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopTab2Page');
  }

  ionViewWillLeave(){
    this.localService.SHOP_IMAGES = this.base64Images;
  }

  ionViewWillEnter(){
    this.base64Images = this.localService.SHOP_IMAGES;
  }

  takePhoto(){
    this.selectPhotoByBrowser();
  }

  selectPhotoByBrowser() {
    console.log('select photo')
    document.getElementById('inputFile').click();
  }

  takePictureAndResizeByBrowser(event) {
    this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          this.base64Images = imgDataUrls;
        }, 1000);
      })
  }

}
