import { Injectable } from '@angular/core';

import { AppService } from './app.service';
import { DbService } from './db.service';
import { LocalService } from './local.service';
import { GchartService } from './gchart.service';

import { iOrder } from '../interfaces/order.interface';
import { iItem } from '../interfaces/item.interface';
declare var google: any;

@Injectable()

export class StatisticService {

    constructor(
        private appService: AppService,
        private dbService: DbService,
        private localService: LocalService,
        private gchartService: GchartService
    ) { }

    getSUMofDATE(DATE: string, SHOP_ID: string, SHOP_ITEMS, SHOP_ITEMS_ID) {
        console.log('start getSUMofDATE()');
        return new Promise((resolve, reject)=>{
            this.getOrderList(DATE, SHOP_ID)
            // 1. get List of Order
            .then((ORDER_LISTS: any[]) => {
                console.log(ORDER_LISTS);
                // this.ORDER_LISTS = ORDER_LISTS
                this.getORDERwithFilter(ORDER_LISTS, SHOP_ITEMS, SHOP_ITEMS_ID).then((ORDER_filter_list: any[]) => {
                    console.log(ORDER_filter_list);
                    this.getFinalSUM(SHOP_ITEMS_ID, ORDER_filter_list).then((finalSUM: any[]) => {
                        console.log(finalSUM);
                        let DATA4CHART: any[] = this.getDATA4Chart(finalSUM);
                        let TotalPrice = this.getTotalPrice(finalSUM);
                        console.log(DATA4CHART, TotalPrice);
                        resolve({TotalOfDATE: TotalPrice, DATA4CHART: DATA4CHART, finalSUM: finalSUM,ORDER_filter_list: ORDER_filter_list, ORDER_LISTS: ORDER_LISTS });
                    })
                })
            })
        })
    }

    getOrderList(DATE: string, SHOP_ID: string) {
        console.log('start getOrderList()');
        return new Promise((resolve, reject) => {
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

    getORDERwithFilter(ORDER_LISTS: any[], SHOP_ITEMS, SHOP_ITEMS_ID) {
        console.log('start getORDERwithFilter()');
        return new Promise((resolve, reject) => {
            let ORDER_filter_list = [];
            ORDER_LISTS.forEach(ORDER_LIST => {
                let index = SHOP_ITEMS_ID.indexOf(ORDER_LIST.item);
                let item = {
                    ID: ORDER_LIST.item,
                    AMOUNT: ORDER_LIST.amount,
                    NAME_LOC: SHOP_ITEMS[index].ITEM_NAME_LOCAL,
                    NAME_EN: SHOP_ITEMS[index].ITEM_NAME_EN,
                    SIZE: SHOP_ITEMS[index].ITEM_SIZE,
                    PRICE: SHOP_ITEMS[index].ITEM_PRICE
                };
                ORDER_filter_list.push(item);
            });
            console.log(ORDER_filter_list);
            resolve(ORDER_filter_list);
        })
    }

    getFinalSUM(SHOP_ITEMS_ID, ORDER_filter_list) {
        console.log('start getFinalSUM()');
        return new Promise((resolve, reject) => {
            let finalSUM = [];
            SHOP_ITEMS_ID.forEach(ITEM_ID => {
                let count = 0;
                let item = null;
                for (var index = 0; index < ORDER_filter_list.length; index++) {
                    if (ORDER_filter_list[index].ID === ITEM_ID) {
                        count += ORDER_filter_list[index].AMOUNT;
                        item = ORDER_filter_list[index];
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

    getTotalPrice(finalSUM) {
        console.log('start getTotalPrice()');
        let TOTAL_PRICE = 0
        finalSUM.forEach((item: any) => {
            TOTAL_PRICE += item.AMOUNT * item.PRICE
        })
        console.log('ToTalPRICE of the day: ', TOTAL_PRICE);
        return TOTAL_PRICE;
    }
}
