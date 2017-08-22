import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { GchartService } from '../../services/gchart.service'
import { iOrder } from '../../interfaces/order.interface';
import { iItem } from '../../interfaces/item.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-order-statistic',
  templateUrl: 'order-statistic.html',
})
export class OrderStatisticPage {
  DATE: string = '2017/07/29';
  selectedDate: string = null;
  SHOP_ID: string = '-Kp98d8gamYNpWHiDAVf';
  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  ORDER_LISTS: any[] = [];
  ORDER_filter_list: any[] = [];
  finalSUM: any[] = [];
  DATA2CHART: any[] = [];
  TOTAL_PRICE: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private dbService: DbService,
    private localService: LocalService,
    private gchartService: GchartService
  ) {

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
          this.getSUMofDATE();
        })
    } else {
      this.getSUMofDATE();
    }

    // this.drawChart();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatisticPage');
  }

  ionViewWillEnter() {
    // this.selectedDate = '2017-07-31';
    this.selectedDate = this.appService.convertDateFormat1(this.DATE);
    console.log(this.DATE, this.selectedDate);
  }

  getSUMofDATE() {
    console.log('start getSUMofDATE()');
    this.getOrderList()
      // 1. get List of Order
      .then((ORDER_LISTS: any[]) => {
        console.log(ORDER_LISTS);
        this.ORDER_LISTS = ORDER_LISTS
      })
      // 2. get new list of Order with filter
      .then(() => {
        this.getORDERwithFilter();
      })
      // 3. get new list of order with sum
      .then(() => {
        return this.getFinalSUM().then((finalSum: any[]) => {
          this.finalSUM = finalSum;
        })
      })
      // 4. get totalprice & array of data for chart
      .then(() => {
        this.getTotalPrice();
        let DATA4CHART = this.getDATA4Chart(this.finalSUM);
        this.drawChart(DATA4CHART);
        this.drawChartCurveLine();
        this.drawMaterialChart();
        this.drawNLineChart();
      })
  }

  getORDERwithFilter() {
    console.log('start getORDERwithFilter()');
    return new Promise((resolve, reject) => {
      this.ORDER_filter_list = [];
      this.ORDER_LISTS.forEach(ORDER_LIST => {
        let index = this.SHOP_ITEMS_ID.indexOf(ORDER_LIST.item);
        let item = {
          ID: ORDER_LIST.item,
          AMOUNT: ORDER_LIST.amount,
          NAME_LOC: this.SHOP_ITEMS[index].ITEM_NAME_LOCAL,
          NAME_EN: this.SHOP_ITEMS[index].ITEM_NAME_EN,
          SIZE: this.SHOP_ITEMS[index].ITEM_SIZE,
          PRICE: this.SHOP_ITEMS[index].ITEM_PRICE
        };
        this.ORDER_filter_list.push(item);
      });
      console.log(this.ORDER_filter_list);
      resolve(this.ORDER_filter_list);
    })
  }

  getTotalPrice() {
    console.log('start getTotalPrice()');
    this.TOTAL_PRICE = 0
    this.finalSUM.forEach((item: any) => {
      this.TOTAL_PRICE += item.AMOUNT * item.PRICE
    })

  }

  getFinalSUM() {
    console.log('start getFinalSUM()');
    return new Promise((resolve, reject) => {
      let finalSUM = [];
      this.SHOP_ITEMS_ID.forEach(ITEM_ID => {
        let count = 0;
        let item = null;
        for (var index = 0; index < this.ORDER_filter_list.length; index++) {
          if (this.ORDER_filter_list[index].ID === ITEM_ID) {
            count += this.ORDER_filter_list[index].AMOUNT;
            item = this.ORDER_filter_list[index];
          }
        }
        if (item != null) {
          item['AMOUNT'] = count;
          finalSUM.push(item);
        }
      })
      console.log(finalSUM);
      resolve(finalSUM)
    })
  }

  getDATA4Chart(array: any) {
    console.log('start getDATA4Chart()');
    let DATA2CHART: any[] = [];
    array.forEach((item: any) => {
      DATA2CHART.push([item.NAME_EN, item.AMOUNT * item.PRICE]);
    })
    console.log(DATA2CHART);
    return DATA2CHART;
  }

  getOrderList() {
    console.log('start getOrderList()');
    return new Promise((resolve, reject) => {
      let DATE = this.DATE;
      let SHOP_ID = this.SHOP_ID;
      let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;
      this.dbService.getListReturnPromise_ArrayOfData(URL).then((ORDERS: iOrder[]) => {
        // console.log(ORDERS);
        let ORDER_LISTS = [];
        ORDERS.forEach(ORDER => {
          // console.log(ORDER.ORDER_LIST);
          ORDER_LISTS = ORDER_LISTS.concat(ORDER.ORDER_LIST);
        })
        // console.log(ORDER_LISTS);
        resolve(ORDER_LISTS);
      })
    })
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
    this.getSUMofDATE();
  }

  drawChart(DATA2CHART) {
    console.log('start drawChart()');
    google.charts.load('current', { 'packages': ['corechart'] }).then(() => {
      let chart2 = new google.visualization.PieChart(document.getElementById('chart_div2'));
      // second chart
      let chart3 = new google.visualization.BarChart(document.getElementById('chart_div3'));
      let DATAS = DATA2CHART;
      this.gchartService.drawChart('Total on ' + this.DATE, 320, 300, DATAS).then((res: any) => {
        chart2.draw(res.data, res.options);
        chart3.draw(res.data, res.options);
      })


    })
  }

  drawChartCurveLine() {
    google.charts.load('current', { 'packages': ['corechart'] }).then(() => {
      let chart = new google.visualization.LineChart(document.getElementById('chart_div4'));
      this.gchartService.drawChartCurveLine().then((res: any) => {
        chart.draw(res.data, res.options)
      })
    })
  }

  drawMaterialChart() {
    google.charts.load('current', { 'packages': ['line'] }).then(() => {
      let chart = new google.charts.Line(document.getElementById('chart_div5'));
      this.gchartService.drawMaterialChart().then((res: any) => {
        chart.draw(res.data, google.charts.Line.convertOptions(res.options))
      })
    })
  }

  drawNLineChart() {
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawCurveTypes => {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Dogs');
      data.addColumn('number', 'Cats');

      data.addRows([
        [0, 0, 0], [1, 10, 5], [2, 23, 15], [3, 17, 9], [4, 18, 10], [5, 9, 5],
        [6, 11, 3], [7, 27, 19], [8, 33, 25], [9, 40, 32], [10, 32, 24], [11, 35, 27],
        [12, 30, 22], [13, 40, 32], [14, 42, 34], [15, 47, 39], [16, 44, 36], [17, 48, 40],
        [18, 52, 44], [19, 54, 46], [20, 42, 34], [21, 55, 47], [22, 56, 48], [23, 57, 49],
        [24, 60, 52], [25, 50, 42], [26, 52, 44], [27, 51, 43], [28, 49, 41], [29, 53, 45],
        [30, 55, 47], [31, 60, 52], [32, 61, 53], [33, 59, 51], [34, 62, 54], [35, 65, 57],
        [36, 62, 54], [37, 58, 50], [38, 55, 47], [39, 61, 53], [40, 64, 56], [41, 65, 57],
        [42, 63, 55], [43, 66, 58], [44, 67, 59], [45, 69, 61], [46, 69, 61], [47, 70, 62],
        [48, 72, 64], [49, 68, 60], [50, 66, 58], [51, 65, 57], [52, 67, 59], [53, 70, 62],
        [54, 71, 63], [55, 72, 64], [56, 73, 65], [57, 75, 67], [58, 70, 62], [59, 68, 60],
        [60, 64, 56], [61, 60, 52], [62, 65, 57], [63, 67, 59], [64, 68, 60], [65, 69, 61],
        [66, 70, 62], [67, 72, 64], [68, 75, 67], [69, 80, 72]
      ]);

      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Popularity'
        },
        series: {
          1: { curveType: 'function' }
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div6'));
      chart.draw(data, options);
    });


  }

}
