import { Injectable } from '@angular/core';
import { AppService } from './app.service';

import * as firebase from 'firebase/app';
import { LocalService } from './local.service';

@Injectable()

export class ShopService {

    constructor(
        private appService: AppService,
        private localService: LocalService
    ){

    }
    getShopsNearBy(LAT: number, LNG: number) {
        return new Promise((resolve, reject) => {
            console.log(LAT, LNG);
            let latArray: any[] = [];
            let lngArray: any[] = [];
            let itemArray: any[] = [];
            let db = firebase.database();
            const loca = db.ref('ShopsLOCATION');
            const query1 = loca
                .orderByChild('lat')
                .startAt(LAT - 0.1)
                .endAt(LAT + 0.1)
            let pro1 = query1.once('value', snap => {
                console.log(snap);
                snap.forEach((child: any) => {
                    console.log(child.val(), child.key)
                    latArray.push(child.key);
                    itemArray.push(child.val());
                    return false
                })
            })

            const query2 = loca
                .orderByChild('lng')
                .startAt(LNG - 0.1)
                .endAt(LNG + 0.2)
            let pro2 = query2.once('value', snap => {
                console.log(snap);
                snap.forEach((child: any) => {
                    console.log(child.val(), child.key)
                    lngArray.push(child.key);
                    return false
                })
            })

            Promise.all([pro1, pro2])
                .then(() => {
                    let final = this.appService.commonOf2Arrays(latArray, lngArray);
                    // this.localService.SHOPs_NEARBY = final;
                    let finalLOC = [];
                    console.log(final);
                    let finalz = Array.from(new Set(final));
                    console.log(finalz);
                    finalz.forEach(ID => {
                        let index = latArray.indexOf(ID);
                        finalLOC.push(itemArray[index]);
                    });
                    // this.localService.SHOPs_LOCATION = finalLOC;
                    console.log(finalLOC);
                    // this.localService.shopsLoaded = true;
                    resolve({SHOP_IDs: finalz, SHOP_locations: finalLOC});
                })
                .catch((err) => { 
                    console.log(err);
                    reject(err);
                })
        })
    }

    getShopsInDetail(SHOPID_LIST: any[]){
        // let ShopSInDetailList = [];
        let SHOP_LIST = Array.from(new Set(SHOPID_LIST));
        this.localService.SHOPs_NEARBY_DETAIL = [];
        SHOP_LIST.forEach(SHOPID=>{
            let db = firebase.database().ref('Shops/'+SHOPID);
            db.once('value')
            .then((data)=>{
                console.log(data.val())
                // ShopSInDetailList.push(data.val());
                this.localService.SHOPs_NEARBY_DETAIL.push(data.val())
            })
            .catch(err => {
                console.log(err)
            })
        })
    }

    getShops(LAT: number, LNG: number){
        this.getShopsNearBy(LAT, LNG)
        .then((data: any)=>{
            console.log(data);
            this.getShopsInDetail(data.SHOP_IDs)
        })
        .catch((err)=>{ 
            console.log(err);
        })
    }

}