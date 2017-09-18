import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { LocalService } from '../../services/local.service';
import { StatisticService } from '../../services/statistic.service';
// import { GchartService } from '../../services/gchart.service';
import { iItem } from '../../interfaces/item.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-order-range-statistic',
  templateUrl: 'order-range-statistic.html',
})
export class OrderRangeStatisticPage {
  selectedDate1: string = null;
  selectedDate2: string = null;

  DATE: string = '2017/07/29';
  SHOP_ID: string = '-Kp98d8gamYNpWHiDAVf';

  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  ORDER_LISTS: any[] = [];

  finalSUM: any[] = [];
  // TOTAL_PRICE: number = 0;
  TOTAL_OF_RANGE: number = 0;
  DateArray: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localService: LocalService,
    private statService: StatisticService,
    // private gchartService: GchartService,
    private appService: AppService
  ) {
    this.SHOP_ID = this.navParams.get('SHOP_ID');
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
          // this.getDataThenDrawChart();
        })
    } else {
      // this.getDataThenDrawChart();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderRangeStatisticPage');
  }

  ionViewWillEnter() {
    // this.selectedDate = '2017-07-31';
    this.selectedDate1 = this.appService.convertDateFormat1(this.DATE);
    this.selectedDate2 = this.selectedDate1;
    console.log(this.DATE, this.selectedDate1);
  }

  selectDates() {
    console.log(this.selectedDate1, this.selectedDate2);
    this.DateArray = this.appService.getDateArrayFromDate1toDate2(this.selectedDate1, this.selectedDate2);
    console.log(this.DateArray);
    this.getDataThenDrawChart().then((res: any[])=>{
      console.log(res);
      this.getSUMofTheDays(res);
    })
  }

  getDataThenDrawChart() {
    let promises = [];
    this.DateArray.forEach((DATE, index) => {
      promises[index] = new Promise((resolve, reject) => {
        this.statService.getSUMofDATE(DATE, this.SHOP_ID, this.SHOP_ITEMS, this.SHOP_ITEMS_ID).then((res: any) => {
          console.log(res);
          // dailyTotal = dailyTotal.concat([DATE, res.TotalOfDATE]);
          resolve(res);
        })
      });
    });
    return Promise.all(promises);
  }

  getSUMofTheDays(arr: any[]){
    let dailyTotal: any[] = []
    this.TOTAL_OF_RANGE = 0;
    arr.forEach((array, index)=>{
      this.TOTAL_OF_RANGE += array.TotalOfDATE;
      dailyTotal.push([this.DateArray[index].substr(5,5), array.TotalOfDATE]);
    })
    console.log(dailyTotal);
    this.drawDailySUM(dailyTotal);
  }

  drawDailySUM(DATA_ARRAY) {
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawCurveTypes => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'X');
      data.addColumn('number', 'Daily Total');
      // data.addColumn('number', 'Cats');

      data.addRows(DATA_ARRAY)

      // data.addRows([
      //   [0, 0, 0], [1, 10, 5], [2, 23, 15], [3, 17, 9], [4, 18, 10], [5, 9, 5],
      //   [6, 11, 3], [7, 27, 19], [8, 33, 25], [9, 40, 32], [10, 32, 24], [11, 35, 27],
      //   [12, 30, 22], [13, 40, 32], [14, 42, 34], [15, 47, 39], [16, 44, 36], [17, 48, 40],
      //   [18, 52, 44], [19, 54, 46], [20, 42, 34], [21, 55, 47], [22, 56, 48], [23, 57, 49],
      //   [24, 60, 52], [25, 50, 42], [26, 52, 44], [27, 51, 43], [28, 49, 41], [29, 53, 45],
      //   [30, 55, 47], [31, 60, 52], [32, 61, 53], [33, 59, 51], [34, 62, 54], [35, 65, 57],
      //   [36, 62, 54], [37, 58, 50], [38, 55, 47], [39, 61, 53], [40, 64, 56], [41, 65, 57],
      //   [42, 63, 55], [43, 66, 58], [44, 67, 59], [45, 69, 61], [46, 69, 61], [47, 70, 62],
      //   [48, 72, 64], [49, 68, 60], [50, 66, 58], [51, 65, 57], [52, 67, 59], [53, 70, 62],
      //   [54, 71, 63], [55, 72, 64], [56, 73, 65], [57, 75, 67], [58, 70, 62], [59, 68, 60],
      //   [60, 64, 56], [61, 60, 52], [62, 65, 57], [63, 67, 59], [64, 68, 60], [65, 69, 61],
      //   [66, 70, 62], [67, 72, 64], [68, 75, 67], [69, 80, 72]
      // ]);

      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Daily Total'
        },
        series: {
          1: { curveType: 'function' }
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    });

  }


}
