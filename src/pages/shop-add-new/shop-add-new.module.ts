import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopAddNewPage } from './shop-add-new';

@NgModule({
  declarations: [
    ShopAddNewPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopAddNewPage),
  ],
})
export class ShopAddNewPageModule {}
