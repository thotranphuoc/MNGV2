import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { CrudService } from '../../services/crud.service';
import { AngularFireService } from '../../services/af.service';
import { iShop } from '../../interfaces/shop.interface';
import { iItem } from '../../interfaces/item.interface';
@IonicPage()
@Component({
  selector: 'page-remove',
  templateUrl: 'remove.html',
})
export class RemovePage {
  SHOP: iShop;
  ITEMS: any[]=[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private dbService: DbService,
    private localService: LocalService,
    private crudService: CrudService,
    private afService: AngularFireService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemovePage');
  }

  go2SearchShop() {
    let modal = this.modalCtrl.create('SearchShopPage');
    modal.onDidDismiss((data) => {
      console.log(data);
      this.SHOP = data.SHOP;
      this.getItems(this.SHOP.SHOP_ID);
    })
    modal.present().catch((err) => { console.log(err) });
  }

  getItems(SHOP_ID){
    // this.afService.getList('Shop_Items/'+ SHOP_ID)
    // .subscribe((ITEMS_ID: any[])=>{
    //     this.ITEMS = [];
    //     ITEMS_ID.forEach((ITEM_ID)=>{
    //       this.dbService.getOneItemReturnPromise('Items/' + ITEM_ID.$value)
    //       .then((res: iItem) => {
    //         // console.log(res);
    //         this.ITEMS.push(res);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       })
    //     })
    // })
    this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(SHOP_ID)
    .then((res:any)=>{
      this.ITEMS = res.SHOP_ITEMS;
      this.ITEMS.map(ITEM => ITEM['isDeleted'] = false);
      console.log(this.ITEMS);
    })
    .catch((err)=>{ console.log(err)});
  }

  deleteItem(item,i){
    console.log(item);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Item deleting start ...');
            this.crudService.deleteItem(item);
            item.isDeleted = true;
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

}
