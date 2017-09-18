import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// import { AngularFireService } from '../../services/af.service';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-add-new-shop',
  templateUrl: 'add-new-shop.html',
})
export class AddNewShopPage {
  tab1Root = 'AddNewShopTab1Page';
  tab2Root = 'AddNewShopTab2Page';
  tab3Root = 'AddNewShopTab3Page';
  tab4Root = 'AddNewShopTab4Page';

  shop: iShop;
  shopList: iShop[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    // private afService: AngularFireService
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopPage');
  }


}
