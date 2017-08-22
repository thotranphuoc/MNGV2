import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewShopTab2Page } from './add-new-shop-tab2';

@NgModule({
  declarations: [
    AddNewShopTab2Page,
  ],
  imports: [
    IonicPageModule.forChild(AddNewShopTab2Page),
  ],
  exports: [
    AddNewShopTab2Page
  ]
})
export class AddNewShopTab2PageModule {}
