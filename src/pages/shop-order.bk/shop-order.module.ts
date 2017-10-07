import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopOrderPage } from './shop-order';

@NgModule({
  declarations: [
    ShopOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopOrderPage),
  ],
  exports: [
    ShopOrderPage
  ]
})
export class ShopOrderPageModule {}
