import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, 
  // ActionSheetController, 
  ViewController
 } from 'ionic-angular';

import { ImageService } from '../../services/image.service';
@IonicPage()
@Component({
  selector: 'page-photo-take',
  templateUrl: 'photo-take.html',
})
export class PhotoTakePage {
  data: any;
  base64Images: string[] = [];
  newPhoto: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private actionSheetCtrl: ActionSheetController,
    private viewCtrl: ViewController,
    private imageService: ImageService
  ) {
    this.data = this.navParams.data;
    this.base64Images = this.data.PHOTOS;
    console.log(this.data);
    if(typeof(this.base64Images) === 'undefined'){
      this.base64Images = [];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosTakePage');
  }

  takePhoto() {
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
          this.newPhoto = true;
          // if(this.base64Images){
          //   this.base64Images = this.base64Images.concat(imgDataUrls)
          // }else{
          //   this.base64Images = imgDataUrls;
          // }
        }, 2000)
      })
      .catch((err) => console.log(err))
  }

  selectPhoto(i) {
    // let actionSheet = this.actionSheetCtrl.create({
    //   buttons: [
    //     {
    //       text: 'Remove',
    //       role: 'destructive',
    //       handler: () => {
    //         console.log('Delete clicked');
    //         this.removePhoto(i);
    //       }
    //     }, {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     }
    //   ]
    // });
    // actionSheet.present();
  }

  // removePhoto(index){
  //  if(this.base64Images.length>1){
  //   this.base64Images.splice(index,1);
  //  }else{

  //  }
  // }

  setPhotos(){
    this.viewCtrl.dismiss({ isCancel: false, PHOTOS: this.base64Images })
    .then((res)=>{ console.log(res)})
    .catch((err)=>{ console.log(err)})

  }

  doCancel(){
    this.viewCtrl.dismiss({ isCancel: true, PHOTOS: this.base64Images })
    .then((res)=>{ console.log(res)})
    .catch((err)=>{ console.log(err)})
  }

}
