import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
// import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-shop-menu',
  templateUrl: 'shop-menu.html',
})
export class ShopMenuPage {
  loading: any;
  shop: iShop = null;
  SHOP_ITEMS: any[] = [];
  SHOP_ITEMS_ID: any[] = [];
  SHOP_ITEMS_INDEX: any[] = [];
  USER_ID: string = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private app: App,
    // private dbService: DbService,
    private afService: AngularFireService,
    private localService: LocalService
  ) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });

    this.startLoading();

    if(this.afService.getAuth().auth.currentUser){
      this.USER_ID = this.afService.getAuth().auth.currentUser.uid;
    }else{
      this.USER_ID = null;
    }
    this.shop = navParams.data;
    console.log(this.shop);
    if(this.shop.SHOP_ID){
      this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.shop.SHOP_ID).then((res: any)=>{
        this.SHOP_ITEMS = res.SHOP_ITEMS;
        this.SHOP_ITEMS_ID = res.SHOP_ITEMS_ID;
        this.SHOP_ITEMS_INDEX =[];
        let l = this.SHOP_ITEMS_ID.length
        for (let index = 0; index < l; index++) {
          this.SHOP_ITEMS_INDEX.push({count: 0});
        }
        console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID, this.SHOP_ITEMS_INDEX);
        this.hideLoading();
      })
      .catch((err)=>{
        console.log(err);
        this.hideLoading();
      })
    }else{
      this.hideLoading();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopMenuPage');
  }

  ionViewWillEnter() {
    this.SHOP_ITEMS_INDEX = this.localService.SHOP_ITEMS_INDEX;
  }

  go2MenuItemAdd() {
    console.log(this.shop.SHOP_ID);
    this.app.getRootNav().push('MenuItemAddPage', { SHOP_ID: this.shop.SHOP_ID });
  }

  go2AddFavorite(){
    console.log('add favroite clicked');
    this.app.getRootNav().push('FavoriteAddPage', { SHOP_ITEMS: this.SHOP_ITEMS, SHOP_ITEMS_ID: this.SHOP_ITEMS_ID, SHOP: this.shop})
  }

  selectITEM(i) {
    console.log(i);
    this.SHOP_ITEMS_INDEX[i].count++;
  }

  ionViewWillLeave() {
    this.localService.SHOP_ITEMS = this.SHOP_ITEMS;
    this.localService.SHOP_ITEMS_ID = this.SHOP_ITEMS_ID;
    this.localService.SHOP_ITEMS_INDEX = this.SHOP_ITEMS_INDEX;
  }

  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss().catch((err) => { console.log(err)});
  }
}
