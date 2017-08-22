import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateItemsPage } from './update-items';

@NgModule({
  declarations: [
    UpdateItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateItemsPage),
  ],
  exports: [
    UpdateItemsPage
  ]
})
export class UpdateItemsPageModule {}
