import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDailyStatisticPage } from './order-daily-statistic';

@NgModule({
  declarations: [
    OrderDailyStatisticPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderDailyStatisticPage),
  ],
  exports: [
    OrderDailyStatisticPage
  ]
})
export class OrderDailyStatisticPageModule {}
