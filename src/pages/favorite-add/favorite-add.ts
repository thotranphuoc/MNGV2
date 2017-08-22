import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DbService } from '../../services/db.service';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-favorite-add',
  templateUrl: 'favorite-add.html',
})
export class FavoriteAddPage {
  data: any;
  SHOP_ITEMS: any[] = [];
  SHOP_ITEMS_ID: string[] = [];
  shop: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private dbService: DbService) {
    this.data = this.navParams.data;
    this.SHOP_ITEMS = this.data.SHOP_ITEMS;
    let l = this.SHOP_ITEMS.length;
    this.SHOP_ITEMS.forEach(item => {
      item['isLiked'] = false;
    })
    this.shop = this.data.SHOP;
    console.log(this.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoriteAddPage');
  }

  addFav(item, i) {
    console.log(item, i);
    this.SHOP_ITEMS[i].isLiked = !this.SHOP_ITEMS[i].isLiked;
  }

  ionViewWillEnter() {
    // get current favorite of shop
    let USER_ID = this.afAuth.auth.currentUser.uid;
    let SHOP_ID = this.shop.SHOP_ID;
    this.dbService.getListReturnPromise_ArrayOfData('Favorites/' + USER_ID + '/' + SHOP_ID).then((res: string[]) => {
      console.log(res);
      this.SHOP_ITEMS.forEach(item => {
        let i = res.indexOf(item.ITEM_ID)
        if (i < 0) {
          item['isLiked'] = false;
        } else {
          item['isLiked'] = true;
        }
      })
    })
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave called')
    // update favorite of user
    let Likes = [];
    this.SHOP_ITEMS.forEach(item => {
      if (item.isLiked) {
        Likes.push(item.ITEM_ID);
      }
    })
    console.log(Likes);
    let USER_ID = this.afAuth.auth.currentUser.uid;
    let SHOP_ID = this.shop.SHOP_ID;
    this.dbService.insertAnObjectAtNode('Favorites/' + USER_ID + '/' + SHOP_ID, Likes).then((res) => {
      console.log('insert done')
    })
      .catch((err) => {
        console.log(err);
      })
  }

}
