import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopBillPage } from './shop-bill';

@NgModule({
  declarations: [
    ShopBillPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopBillPage),
  ],
  exports: [
    ShopBillPage
  ]
})
export class ShopBillPageModule {}
