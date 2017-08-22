import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewShopPage } from './add-new-shop';

@NgModule({
  declarations: [
    AddNewShopPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewShopPage),
  ],
  exports: [
    AddNewShopPage
  ]
})
export class AddNewShopPageModule {}
