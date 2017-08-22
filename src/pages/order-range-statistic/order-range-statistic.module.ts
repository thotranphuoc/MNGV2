import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderRangeStatisticPage } from './order-range-statistic';

@NgModule({
  declarations: [
    OrderRangeStatisticPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderRangeStatisticPage),
  ],
  exports: [
    OrderRangeStatisticPage
  ]
})
export class OrderRangeStatisticPageModule {}
