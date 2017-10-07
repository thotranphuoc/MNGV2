import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopMenuPage } from './shop-menu';

@NgModule({
  declarations: [
    ShopMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopMenuPage),
  ],
  exports: [
    ShopMenuPage
  ]
})
export class ShopMenuPageModule {}
