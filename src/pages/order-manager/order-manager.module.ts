import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderManagerPage } from './order-manager';

@NgModule({
  declarations: [
    OrderManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderManagerPage),
  ],
  exports: [
    OrderManagerPage
  ]
})
export class OrderManagerPageModule {}
