import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { CrudService } from '../../services/crud.service';
import { DbService } from '../../services/db.service';
import { iItem } from '../../interfaces/item.interface';
import { iShop } from '../../interfaces/shop.interface';
@IonicPage()
@Component({
  selector: 'page-clone',
  templateUrl: 'clone.html',
})
export class ClonePage {
  DSHOP: iShop;
  SSHOP: iShop;
  SITEMS: iItem[] = [];
  DITEMS: iItem[] = [];
  CloneStatus: boolean[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private localService: LocalService,
    private crudService: CrudService,
    private afService: AngularFireService,
    private appService: AppService,
    private dbService: DbService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClonePage');
  }

  getSourceShop() {
    console.log('getSourceShop...');
    let modal = this.modalCtrl.create('SearchShopPage');
    modal.onDidDismiss((data) => {
      console.log(data);
      if (typeof (data) !== 'undefined') {
        this.SSHOP = data.SHOP;
        // this.SHOP_ID = this.SHOP.SHOP_ID;
        // this.afService.getList('Shop_Items/' + this.SSHOP.SHOP_ID)
        //   .subscribe((ITEMS_ID: any[]) => {
        //     console.log(ITEMS_ID);
        //     this.SITEMS = [];
        //     this.CloneStatus = [];
        //     ITEMS_ID.forEach(ITEM_ID => {
        //       this.dbService.getOneItemReturnPromise('Items/' + ITEM_ID.$value)
        //         .then((res: iItem) => {
        //           // console.log(res);
        //           this.SITEMS.push(res);
        //           this.CloneStatus.push(false)
        //         })
        //         .catch((err) => {
        //           console.log(err);
        //         })
        //     });
        //     // this.ITEMS.reverse();
        //     console.log(this.SITEMS);
        //   })
        this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.SSHOP.SHOP_ID)
        .then((res: any)=>{
          console.log(res);
          this.SITEMS = res.SHOP_ITEMS;
        })
      } else {
        this.SSHOP = null;
      }
    })
    modal.present().then((res) => { console.log(res) }).catch((err) => { console.log(err) });
  }

  getDestionationShop() {
    console.log('getSourceShop...');
    let modal = this.modalCtrl.create('SearchShopPage');
    modal.onDidDismiss((data) => {
      console.log(data);
      if (typeof (data) !== 'undefined') {
        this.DSHOP = data.SHOP;
        // this.SHOP_ID = this.SHOP.SHOP_ID;
        this.afService.getList('Shop_Items/' + this.DSHOP.SHOP_ID)
          .subscribe((ITEMS_ID: any[]) => {
            console.log(ITEMS_ID);
            this.DITEMS = [];
            ITEMS_ID.forEach(ITEM_ID => {
              this.dbService.getOneItemReturnPromise('Items/' + ITEM_ID.$value)
                .then((res: iItem) => {
                  // console.log(res);
                  this.DITEMS.push(res);
                })
                .catch((err) => {
                  console.log(err);
                })
            });
            // this.ITEMS.reverse();
            console.log(this.DITEMS);
          })
      } else {
        this.DSHOP = null;
      }
    })
    modal.present().then((res) => { console.log(res) }).catch((err) => { console.log(err) });
  }

  cloneItem(item, i) {
    console.log(item, i);
    if (typeof (this.DSHOP) !== 'undefined') {
      item['ITEM_SHOP_ID'] = this.DSHOP.SHOP_ID;
      // this.crudService.createItem(this.DSHOP.SHOP_ID,item,)
      this.crudService.cloneItem(item, this.SSHOP.SHOP_ID, this.DSHOP.SHOP_ID)
        .then((res) => {
          console.log(res);
          this.CloneStatus[i] = true;
        })
        .catch((err) => {
          console.log(err);
        })
    }else{
      alert('Please select destionation shop');
    }
  }

}
