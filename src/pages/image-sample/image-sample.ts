import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CrudService } from '../../services/crud.service';
import { AppService } from '../../services/app.service';
@IonicPage()
@Component({
  selector: 'page-image-sample',
  templateUrl: 'image-sample.html',
})
export class ImageSamplePage {
  NOT_IMAGE = 'imagenotavailable.png';
  IMAGES: any[] =[];
  IMAGES_TEMP: any[] =[];
  IMAGES_BK: any;
  IMAGE: iIMG = null;
  toBeUpdated: boolean = false;
  toAddNew: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private crudService: CrudService,
    private appService: AppService
  ) {
    this.getImages();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageSamplePage');
  }

  getImages(){
    this.crudService.getImages().then((data: any[])=>{
      console.log(data);
      this.IMAGES = [];
      // data.forEach((item: any) =>{
      //   this.IMAGES.push({ key: item.key, IMG_NAME: item.data.IMG_NAME, IMG_URL: item.data.IMG_URL, VISIBLE: false });
      // });
      this.IMAGES = data;
      this.IMAGES.map(image => image['VISIBLE']=false)
      this.IMAGES_BK = this.IMAGES;
      console.log(this.IMAGES);
    })
  }

  editImage(image, i){
    console.log(image, i);
    this.IMAGE = image.data;
    // this.toBeUpdated = true;
    this.toAddNew = false;
    this.IMAGES[i].VISIBLE = !this.IMAGES[i].VISIBLE ;
  }

  addNew(){
    this.IMAGE = null;
    this.toAddNew = !this.toAddNew;
    // this.toBeUpdated = false;
    this.IMAGE = { IMG_CODE: null, IMG_NAME: null, IMG_URL: null}
  }

  onCreate(){
    console.log(this.IMAGE);
    this.crudService.createImage(this.IMAGE)
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{console.log(err)})
  }

  onUpdate(image){
    console.log(image)
    this.crudService.updateImage(image.data, image.key).then((res)=>{
      console.log('success: ', res);
      image.VISIBLE = !image.VISIBLE;
      this.appService.toastMsg('update success', 5000);
    })
    .catch((err)=>{
      console.log('error: ', err);
    })
  }

  getItems(event) {
    console.log(event.srcElement.value);
    let srcStr = null;
    if (typeof (event.srcElement.value) != 'undefined') {
      let srcStr = event.srcElement.value.trim();
      if (srcStr) {
        this.searchString(srcStr);
      } else {
        console.log('no string')
        this.IMAGES = this.IMAGES_BK;
      }
    } else {
      // this.IMAGES = [];
    }
  }

  searchString(searchStr: string) {
    console.log(searchStr);
    this.IMAGES = this.IMAGES_BK;
    this.IMAGES = this.IMAGES.filter(image => image.data.IMG_NAME.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase())>=0);
    console.log(this.IMAGES);
  }



}

export interface iIMG{
  IMG_URL: string, 
  IMG_NAME: string,
  IMG_CODE: string
}
