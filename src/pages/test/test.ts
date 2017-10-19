import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { iItem } from '../../interfaces/item.interface';
import { iShop } from '../../interfaces/shop.interface';
@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  ITEMS: iItem[] =[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,
  ) {
    this.checkItems();
    this.checkShops();
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

  


}
