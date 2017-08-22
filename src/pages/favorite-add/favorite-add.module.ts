import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoriteAddPage } from './favorite-add';

@NgModule({
  declarations: [
    FavoriteAddPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoriteAddPage),
  ],
  exports: [
    FavoriteAddPage
  ]
})
export class FavoriteAddPageModule {}
