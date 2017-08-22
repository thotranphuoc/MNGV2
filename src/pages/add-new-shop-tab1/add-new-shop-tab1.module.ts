import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewShopTab1Page } from './add-new-shop-tab1';

@NgModule({
  declarations: [
    AddNewShopTab1Page,
  ],
  imports: [
    IonicPageModule.forChild(AddNewShopTab1Page),
  ],
  exports: [
    AddNewShopTab1Page
  ]
})
export class AddNewShopTab1PageModule {}
