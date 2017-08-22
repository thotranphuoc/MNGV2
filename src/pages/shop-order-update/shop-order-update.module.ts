import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopOrderUpdatePage } from './shop-order-update';

@NgModule({
  declarations: [
    ShopOrderUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(ShopOrderUpdatePage),
  ],
  exports: [
    ShopOrderUpdatePage
  ]
})
export class ShopOrderUpdatePageModule {}
