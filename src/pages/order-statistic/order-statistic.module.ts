import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderStatisticPage } from './order-statistic';

@NgModule({
  declarations: [
    OrderStatisticPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderStatisticPage),
  ],
  exports: [
    OrderStatisticPage
  ]
})
export class OrderStatisticPageModule {}
