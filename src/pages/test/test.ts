import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AngularFireService } from '../../services/af.service';
import { iItem } from '../../interfaces/item.interface';
import { iShop } from '../../interfaces/shop.interface';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  ITEMS: iItem[] =[];
  SHOPS: Observable<any[]>;
  base64Images: string[] =[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private dbService: DbService,
    private afService: AngularFireService
  ) {
    // this.checkItems();
    // this.checkShops();
    this.checkShopImages();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

  checkItems(){
    this.dbService.getListReturnPromise_ArrayOfData('Items/')
    .then((res: iItem[])=>{
      console.log(res);
      res.forEach(item =>{
        if(!item.ITEM_CATEGORY){
          console.log(item);
          this.dbService.updateAnObjectAtNode('Items/'+item.ITEM_ID+'/ITEM_CATEGORY', 'Drinks')
          .then((res)=>{ console.log(res)})
          .catch((err)=>{ console.log(err)});
        }

        // let index = item.ITEM_IMAGES[0].indexOf()
        if(item.ITEM_IMAGES.length<2){
          console.log(item);
          this.dbService.updateAnObjectAtNode('Items/'+item.ITEM_ID+'/ITEM_IMAGES', res[0].ITEM_IMAGES)
          .then((res)=>{ console.log(res)})
          .catch((err)=>{ console.log(err)});
        }
      })
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  checkShops(){
    this.dbService.getListReturnPromise_ArrayOfData('Shops/')
    .then((res: iShop[])=>{
      console.log(res);
      res.forEach((shop: iShop) =>{
        if(!shop.SHOP_CATEGORIES){
          console.log(shop);
          this.dbService.updateAnObjectAtNode('Shops/'+shop.SHOP_ID+'/SHOP_CATEGORIES', ['Drinks','Foods'])
          .then((res)=>{ console.log(res, shop )})
          .catch((err)=>{ console.log(err)});
        }
      })
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  checkShopImages(){
    this.SHOPS = this.afService.getList('Shops/');
    // this.dbService.getListReturnPromise_ArrayOfData('Shops/')
    // .then((res: iShop[])=>{
    //   console.log(res);
    //   this.SHOPS = res;
    //   // res.forEach((shop: iShop) =>{
    //   //   if(shop.SHOP_IMAGES.length==2){
    //   //     console.log(shop);
    //   //     this.dbService.deleteFilesFromFireStorageWithHttpsURL(shop.SHOP_IMAGES)
    //   //     .then((res)=>{
    //   //       console.log(res);
    //   //     })
    //   //     .catch((err)=>{ console.log(err)});
    //   //     // this.dbService.updateAnObjectAtNode('Shops/'+shop.SHOP_ID+'/SHOP_CATEGORIES', ['Drinks','Foods'])
    //   //     // .then((res)=>{ console.log(res, shop )})
    //   //     // .catch((err)=>{ console.log(err)});
    //   //   }
    //   // })
    // })
    // .catch((err)=>{
    //   console.log(err);
    // })
  }

  uploadImage(SHOP: iShop){
    console.log(SHOP);
    console.log('takePhotos');
    // this.selectPhotosByBrowser();
    let photosModal = this.modalCtrl.create('PhotoTakePage', { PHOTOS: this.base64Images });
    photosModal.onDidDismiss((data) => {
      console.log(data);
      // this.base64Images = data.PHOTOS;
      // this.hasNewAvatar = true;
      // SHOP.SHOP_IMAGES = typeof (data) !== 'undefined' ? data.PHOTOS: null;
      if(typeof(data) !=='undefined'){
        this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('ShopImages/'+SHOP.SHOP_ID, data.PHOTOS, SHOP.SHOP_ID)
        .then((res)=>{
          this.dbService.updateAnObjectAtNode('Shops/'+SHOP.SHOP_ID+'/SHOP_IMAGES', res)
          .then((res)=>{ console.log(res) })
          .catch((err)=> { console.log(err) });
        })
        .catch((err)=> { console.log(err) });
      }

    });
    photosModal.present()
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) })

  }

  


}
