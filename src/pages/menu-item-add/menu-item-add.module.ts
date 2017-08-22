import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuItemAddPage } from './menu-item-add';

@NgModule({
  declarations: [
    MenuItemAddPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuItemAddPage),
  ],
  exports: [
    MenuItemAddPage
  ]
})
export class MenuItemAddPageModule {}
