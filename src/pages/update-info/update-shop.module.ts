import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateShopPage } from './update-shop';

@NgModule({
  declarations: [
    UpdateShopPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateShopPage),
  ],
  exports: [
    UpdateShopPage
  ]
})
export class UpdateShopPageModule {}
