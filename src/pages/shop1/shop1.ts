import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, FabContainer } from 'ionic-angular';
import { iShop } from '../../interfaces/shop.interface';
import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';

@IonicPage()
@Component({
  selector: 'page-shop1',
  templateUrl: 'shop1.html',
})
export class Shop1Page {
  loading: any;
  SHOP: iShop = null;
  SHOP_ITEMS: any[] = [];
  SHOP_ITEMS_ID: any[] = [];
  USER_ID: string = null;
  n: number = 2;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private localService: LocalService,
    private afService: AngularFireService,
  ) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
    this.SHOP = navParams.data.SHOP;
    if (typeof (this.SHOP) === 'undefined') {
      this.navCtrl.setRoot('HomePage');
    }

    this.localService.SHOP = this.SHOP;
    console.log(this.SHOP);
    this.startLoading();

    if (this.afService.getAuth().auth.currentUser) {
      this.USER_ID = this.afService.getAuth().auth.currentUser.uid;
    } else {
      this.USER_ID = null;
    }

    if (typeof (this.SHOP) !== 'undefined') {
      this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.SHOP.SHOP_ID).then((res: any) => {
        this.SHOP_ITEMS = res.SHOP_ITEMS;
        this.SHOP_ITEMS_ID = res.SHOP_ITEMS_ID;
        this.hideLoading();
      })
        .catch((err) => {
          console.log(err);
          this.hideLoading();
        })
    } else {
      this.hideLoading();
      this.navCtrl.setRoot('HomePage');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Shop1Page');
  }

  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss().catch((err) => { console.log(err) });
  }

  go2AddFavorite(fab: FabContainer) {
    console.log('add favroite clicked');
    fab.close();
    this.navCtrl.push('FavoriteAddPage', { SHOP_ITEMS: this.SHOP_ITEMS, SHOP_ITEMS_ID: this.SHOP_ITEMS_ID, SHOP: this.SHOP })
  }

  go2MenuItemAdd(fab: FabContainer) {
    console.log(this.SHOP);
    fab.close();
    this.navCtrl.push('MenuItemAddPage', { SHOP: this.SHOP });
  }

  doOptions() {
    if (this.n > 1) {
      console.log(this.n);
      this.n--;
    } else {
      console.log(this.n)
      this.n = 3;

    }
  }

  // // For purpose to create THUM_URL only when only IMG_URL available
  // updateDB() {
  //   console.log(this.SHOP_ITEMS);
  //   let IMG: string;
  //   let IMG2: string;
  //   let IMAGES = this.SHOP_ITEMS[0].ITEM_IMAGES;
  //   this.SHOP_ITEMS.forEach((ITEM: any) => {
  //     let URL = 'Items/' + ITEM.ITEM_ID + '/ITEM_IMAGES';
  //     this.afService.updateObjectData(URL, IMAGES);

  //   })

  // }

}
