import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { StatisticService } from '../../services/statistic.service';
// import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { GchartService } from '../../services/gchart.service';
// import { iOrder } from '../../interfaces/order.interface';
import { iItem } from '../../interfaces/item.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-order-daily-statistic',
  templateUrl: 'order-daily-statistic.html',
})
export class OrderDailyStatisticPage {
  data: any;
  DATE: string = '2017/07/29';
  selectedDate: string = null;
  SHOP_ID: string = '-Kp98d8gamYNpWHiDAVf';
  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  ORDER_LISTS: any[] = [];
  // ORDER_filter_list: any[] = [];
  finalSUM: any[] = [];
  // DATA2CHART: any[] = [];
  TOTAL_PRICE: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    // private dbService: DbService,
    private statService: StatisticService,
    private localService: LocalService,
    private gchartService: GchartService
  ) {
    this.data = this.navParams.data;
    this.SHOP_ID = this.data.SHOP_ID;
    if (typeof (this.SHOP_ID) === 'undefined') {
      this.navCtrl.setRoot('HomePage')
        .catch((err) => { console.log(err) });
    }
    this.DATE = this.appService.getCurrentDate();
    this.SHOP_ITEMS = this.localService.SHOP_ITEMS;
    this.SHOP_ITEMS_ID = this.localService.SHOP_ITEMS_ID;
    if (this.SHOP_ITEMS_ID.length < 1) {
      console.log('SHOP_ITEMS, ID are not available yet. getting them...');
      this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.SHOP_ID)
        .then((data: any) => {
          this.SHOP_ITEMS = data.SHOP_ITEMS;
          this.SHOP_ITEMS_ID = data.SHOP_ITEMS_ID;
          console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID);
        })
        .then(() => {
          this.getDataThenDrawChart();
        })
        .catch((err) => { console.log(err) });
    } else {
      this.getDataThenDrawChart();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatisticPage');
  }

  ionViewWillEnter() {
    // this.selectedDate = '2017-07-31';
    this.selectedDate = this.appService.convertDateFormat1(this.DATE);
    console.log(this.DATE, this.selectedDate);
  }

  getDataThenDrawChart() {
    this.statService.getSUMofDATE(this.DATE, this.SHOP_ID, this.SHOP_ITEMS, this.SHOP_ITEMS_ID)
      .then((res: any) => {
        console.log(res.TotalOfDATE, res.DATA4CHART);
        this.TOTAL_PRICE = res.TotalOfDATE;
        this.finalSUM = res.finalSUM;
        this.drawPieBarChart(res.DATA4CHART);
      })
      .catch((err) => { console.log(err) });
  }

  selectDate() {
    console.log('start selectDate()');
    console.log(this.selectedDate);
    if (this.selectedDate != null) {
      this.DATE = this.selectedDate.substr(0, 4) + '/' + this.selectedDate.substr(5, 2) + '/' + this.selectedDate.substr(8, 2);
    } else {
      this.appService.alertMsg('Alert', 'Choose date to show');
    }
    console.log(this.DATE);
    this.getDataThenDrawChart();
  }

  drawPieBarChart(DATA2CHART) {
    console.log('start drawChart()');
    google.charts.load('current', { 'packages': ['corechart'] }).then(() => {
      let chart1 = new google.visualization.PieChart(document.getElementById('chart_div1'));
      let chart2 = new google.visualization.BarChart(document.getElementById('chart_div2'));
      let DATAS: any[] = DATA2CHART;
      this.gchartService.drawChart('Total on ' + this.DATE, 320, 300, DATAS).then((res: any) => {
        chart1.draw(res.data, res.options);
        chart2.draw(res.data, res.options);
      })
        .catch((err) => { console.log(err) });
    })
  }

}

/*
EXPECTED OUTCOME:

1. SHOP_ITEMS & SHOP_ITEMS_ID
2. ORDERS with Filter
3. SUM of each ITEMS
4. TotalPRICE of the day
5. Array Data4Chart

*/