import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopDetailViewPage } from './shop-detail-view';

@NgModule({
  declarations: [
    ShopDetailViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ShopDetailViewPage),
  ],
})
export class ShopDetailViewPageModule {}
