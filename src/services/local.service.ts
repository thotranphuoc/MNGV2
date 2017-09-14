import { Injectable } from '@angular/core';
import { AngularFireService } from './af.service';
import { DbService } from './db.service';
import { AppService } from './app.service';

import { iShop } from '../interfaces/shop.interface';
import { iSetting } from '../interfaces/setting.interface';
import { iItem } from '../interfaces/item.interface';
import { iOrder } from '../interfaces/order.interface';
import { iProfile } from '../interfaces/profile.interface';


@Injectable()

export class LocalService {
    SHOPs_LOCATION: any[] = [];
    SHOPs_NEARBY: any[] = [];
    shopsLoaded: boolean = false;
    SHOP_DEFAULT: iShop = {
        SHOP_ID: null,
        SHOP_OWNER: null,
        SHOP_DATE_CREATE: null,
        SHOP_LOCATION: null,
        SHOP_NAME: null,
        SHOP_KIND: null,
        SHOP_ADDRESS: null,
        SHOP_IMAGES: null,
        SHOP_PHONE: null,
        SHOP_isCREDIT: false,
        SHOP_isMOTO_PARK_FREE: false,
        SHOP_isCAR_PARK_FREE: false,
        SHOP_isMEMBERSHIP: false,
        SHOP_isVISIBLE: true,
        SHOP_CURRENCY: null,
        SHOP_TABLES: ['TB0', 'TB1', 'TB2', 'TB3', 'TB4', 'TB5', 'TB6', 'TB7', 'TB8', 'TB9'],
        SHOP_OTHER: null
    }

    SHOP: iShop = {
        SHOP_ID: null,
        SHOP_OWNER: null,
        SHOP_DATE_CREATE: null,
        SHOP_LOCATION: null,
        SHOP_NAME: null,
        SHOP_KIND: null,
        SHOP_ADDRESS: null,
        SHOP_IMAGES: null,
        SHOP_PHONE: null,
        SHOP_isCREDIT: false,
        SHOP_isMOTO_PARK_FREE: false,
        SHOP_isCAR_PARK_FREE: false,
        SHOP_isMEMBERSHIP: false,
        SHOP_isVISIBLE: true,
        SHOP_CURRENCY: null,
        SHOP_TABLES: ['TB0', 'TB1', 'TB2', 'TB3', 'TB4', 'TB5', 'TB6', 'TB7', 'TB8', 'TB9'],
        SHOP_OTHER: null
    }

    ITEM_DEFAULT: iItem = {
        ITEM_ID: null,
        ITEM_NAME_LOCAL: null,
        ITEM_NAME_EN: null,
        ITEM_IMAGES: [],
        ITEM_PRICE: null,
        ITEM_SIZE: null,
        ITEM_DATE_CREATE: null,
        ITEM_SHOP_ID: null,
        ITEM_ON_SALE: false,
        ITEM_NEW: true,
        ITEM_VISIBLE: true,
        ITEM_IMG_SHARED: false,
        ITEM_OTHER: null
    }

    ITEM: iItem = {
        ITEM_ID: null,
        ITEM_NAME_LOCAL: null,
        ITEM_NAME_EN: null,
        ITEM_IMAGES: [],
        ITEM_PRICE: null,
        ITEM_SIZE: null,
        ITEM_DATE_CREATE: null,
        ITEM_SHOP_ID: null,
        ITEM_ON_SALE: false,
        ITEM_NEW: true,
        ITEM_VISIBLE: true,
        ITEM_IMG_SHARED: false,
        ITEM_OTHER: null
    }

    ITEM_IMG64s_DEFAULT: string[] = null;
    ITEM_IMG64s: string[] = null;

    DEFAULT

    SETTING_DEFAULT: iSetting = {
        setCafe: true,
        setRestaurant: true,
        setTakeAway: true,
        setHomeMade: true,
        setOther: true,
        language: 'english'
    }

    SETTING: iSetting = {
        setCafe: true,
        setRestaurant: true,
        setTakeAway: true,
        setHomeMade: true,
        setOther: true,
        language: 'english'
    }

    SHOP_IMAGE: string;
    SHOP_IMAGES_DEFAULT: string[] = [];
    SHOP_IMAGES: string[] = [];

    //ShopMenuPage, ShopOrderPage
    SHOP_ITEMS = [];
    SHOP_ITEMS_ID = [];
    SHOP_ITEMS_INDEX = [];

    PROFILE_DEFAULT: iProfile = {
        PROFILE_AVATAR_URL: '',
        PROFILE_NAME: '',
        PROFILE_EMAIL: '',
        PROFILE_BIRTHDAY: '',
        PROFILE_TEL: '',
        PROFILE_ADDRESS: '',
        PROFILE_STATE: '',
        PROFILE_VERIFIED: false,
        PROFILE_UID: '',
        PROFILE_PROVIDER: '',
        PROFILE_IDENTIFIER: '',
        PROFILE_CREATED: '',
        PROFILE_OTHERS: null
    }

    PROFILE: iProfile = {
        PROFILE_AVATAR_URL: '',
        PROFILE_NAME: '',
        PROFILE_EMAIL: '',
        PROFILE_BIRTHDAY: '',
        PROFILE_TEL: '',
        PROFILE_ADDRESS: '',
        PROFILE_STATE: '',
        PROFILE_VERIFIED: false,
        PROFILE_UID: '',
        PROFILE_PROVIDER: '',
        PROFILE_IDENTIFIER: '',
        PROFILE_CREATED: '',
        PROFILE_OTHERS: null
    }

    PROFILE_OLD: iProfile = {
        PROFILE_AVATAR_URL: '',
        PROFILE_NAME: '',
        PROFILE_EMAIL: '',
        PROFILE_BIRTHDAY: '',
        PROFILE_TEL: '',
        PROFILE_ADDRESS: '',
        PROFILE_STATE: '',
        PROFILE_VERIFIED: false,
        PROFILE_UID: '',
        PROFILE_PROVIDER: '',
        PROFILE_IDENTIFIER: '',
        PROFILE_CREATED: '',
        PROFILE_OTHERS: null
    }


    itemAction: string = 'add-new';  // add-new, item-update
    existingImageUrls: string[] = [];
    orgExistingImageUrls: string[] = [];
    resizedImages: string[] = [];
    images: any[] = [];
    isUserChosenPositionSet: boolean = false;
    existingSoldItemID: string = null;

    USER_AVATAR: string = null;
    USER_ID: string = null;
    isProfileLoaded: boolean = false;

    constructor(
        private afService: AngularFireService,
        private dbService: DbService,
        private appService: AppService
    ) { }

    getImages() {
        return this.images;
    }
    setImages(images) {
        this.images = images;
    }

    getExistingSoldItemID() {
        return this.existingSoldItemID;
    }
    setExistingSoldItemID(id: string) {
        this.existingSoldItemID = id;
    }


    setItemAction(action: string) {
        this.itemAction = action
    }
    getItemAction() {
        return this.itemAction;
    }
    // For Add-item-new/ CAMERA
    setExistingImageUrls(imageUrls: string[]) {
        this.existingImageUrls = imageUrls;
    }
    getExistingImageUrls() {
        return this.existingImageUrls
    }

    setOrgExistingImageUrls(imageUrls: string[]) {
        this.orgExistingImageUrls = imageUrls;
        console.log(this.orgExistingImageUrls);
    }
    getOrgExistingImageUrls() {
        return this.orgExistingImageUrls
    }

    setResizedImages(resizedImages) {
        this.resizedImages = resizedImages;
    }
    getResizedImages() {
        return this.resizedImages;
    }

    // For Add-item-new // LOCATION
    setIsUserChosenPositionSet(isSet: boolean) {
        this.isUserChosenPositionSet = isSet
    }
    getIsUserChosenPositionSet() {
        return this.isUserChosenPositionSet;
    }

    getUserAvatar() {
        return this.USER_AVATAR;
    }

    setUserAvatar(avatar) {
        this.USER_AVATAR = avatar;
    }

    // initUserInfo() {
    //     return new Promise((resolve, reject) => {
    //         let profile: iProfile = null;
    //         if (this.afService.getAuth().auth.currentUser != null) {
    //             // getProfile
    //             let uid = this.afService.getAuth().auth.currentUser.uid;
    //             this.dbService.getOneItemReturnPromise('UsersProfile/' + uid)
    //                 .then((res) => {
    //                     // console.log(res.val());
    //                     profile = res.val();
    //                     // console.log(profile);
    //                     resolve(profile);
    //                 })
    //         } else {
    //             console.log('user not login');
    //             reject(null);
    //         }
    //     })
    // }



    setNewStatusForOrder(SHOP_ID, USER_ID, NEW_STATUS, ORDER_ID, DATE) {
        if (NEW_STATUS === 'CLOSED') {
            // update OrdersOfShop
            this.afService.updateObjectData('OrdersOfShop/' + SHOP_ID + '/' + DATE + '/' + ORDER_ID + '/ORDER_STATUS', NEW_STATUS);
            this.dbService.copyObjectFromURL2URL('OrdersOfShop/' + SHOP_ID + '/' + DATE, 'ActiveOrdersOfUser/' + USER_ID + '/' + SHOP_ID, ORDER_ID)

            setTimeout(() => {
                this.dbService.removeAnObjectAtNode('ActiveOrdersOfUser/' + USER_ID + '/' + SHOP_ID + '/' + ORDER_ID);
            }, 3000);
        } else {
            // update OrdersOfShop
            this.afService.updateObjectData('OrdersOfShop/' + SHOP_ID + '/' + DATE + '/' + ORDER_ID + '/ORDER_STATUS', NEW_STATUS);
            // this.afService.updateObjectData('ActiveOrdersOfUser/' + USER_ID + '/' + ORDER_ID + '/ORDER_STATUS', NEW_STATUS);
            this.dbService.copyObjectFromURL2URL('OrdersOfShop/' + SHOP_ID + '/' + DATE, 'ActiveOrdersOfUser/' + USER_ID + '/' + SHOP_ID, ORDER_ID)
        }
    }

    sendNewOrder(ORDER: iOrder, SHOP_ID, USER_ID, DATE) {
        return new Promise((resolve, reject) => {
            // 1. Insert item to OrdersOfShop
            this.afService.addItem2List('OrdersOfShop/' + SHOP_ID + '/' + DATE, ORDER)
                .then((res) => {
                    // 2. update ITEM_ID into OrdersOfShop/SHOP_ID/ITEM_ID
                    let ORDER_ID = res.key;
                    this.afService.updateObjectData('OrdersOfShop/' + SHOP_ID + '/' + DATE + '/' + ORDER_ID + '/ORDER_ID', ORDER_ID)
                        .then((resp) => {
                            console.log('Order sending success');
                            // 3. add to array of Orders of user
                            this.dbService.insertElementIntoArray('OrdersOfUser/' + USER_ID + '/' + DATE, 'OrdersOfShop/' + SHOP_ID + '/' + DATE + '/' + ORDER_ID);

                        })

                    //4. insert ActiveOrdersOfUser/USER_ID/SHOP_ID
                    let ActiveORDER = ORDER
                    ActiveORDER['ORDER_ID'] = ORDER_ID;
                    this.dbService.insertAnObjectAtNode('ActiveOrdersOfUser/' + USER_ID + '/' + SHOP_ID + '/' + ORDER_ID, ActiveORDER).then((res) => console.log('active orders of user updated'));
                })
        })
    }

    updateOrder(ORDER_LIST, Order2Update) {
        console.log(ORDER_LIST);
        console.log(Order2Update);
        Order2Update.ORDER_LIST = ORDER_LIST;
        Order2Update.ORDER_STATUS = 'UPDATED';
        let DATE = Order2Update.ORDER_DATE_CREATE.substr(0, 10);
        // update OrdersOfShop
        this.afService.updateObjectData('OrdersOfShop/' + Order2Update.ORDER_SHOP_ID + '/' + DATE + '/' + Order2Update.ORDER_ID, Order2Update)
        // update ActiveOrdersOfUser
        this.afService.updateObjectData('ActiveOrdersOfUser/' + Order2Update.ORDER_USER_ID + '/' + Order2Update.ORDER_SHOP_ID + '/' + Order2Update.ORDER_ID, Order2Update)
    }

    getShopItems_ID(SHOP_ID: string) {
        return this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/' + SHOP_ID)
        // .then((items_id)=>{
        //     console.log(items_id)
        // })
    }

    // get Array of SHOP_ITEMS and array of SHOP_ITEMS_ID
    getItemDataFromListOfItems_ID(ITEMS_ID: string[]) {
        return new Promise((resolve, reject) => {
            let SHOP_ITEMS = [];
            let SHOP_ITEMS_ID = [];
            let length = ITEMS_ID.length;
            let n = 0;
            ITEMS_ID.forEach(ITEM_ID => {
                this.dbService.getOneItemReturnPromise('Items/' + ITEM_ID)
                    .then((item: iItem) => {
                        SHOP_ITEMS.push(item);
                        SHOP_ITEMS_ID.push(item.ITEM_ID);
                        n++;
                        if (n == length) {
                            resolve({ SHOP_ITEMS: SHOP_ITEMS, SHOP_ITEMS_ID: SHOP_ITEMS_ID });
                        }
                    })
            })
        })
    }

    getSHOP_ITEMSnSHOP_ITEMS_ID(SHOP_ID) {
        return new Promise((resolve, reject) => {
            this.getShopItems_ID(SHOP_ID).then((ITEMs_ID: string[]) => {
                console.log(ITEMs_ID);
                if (ITEMs_ID.length > 0) {
                    this.getItemDataFromListOfItems_ID(ITEMs_ID)
                        .then((data: any) => {
                            // console.log(data);
                            // console.log(data.SHOP_ITEMS);
                            // console.log(data.SHOP_ITEMS_ID);
                            resolve(data);
                        })
                        .catch((err) => { reject(err) })
                } else {
                    reject({ data: null });
                }
            })
                .catch((err) => { reject(err) })
        })
    }

    getSHOPs_ID(USER_ID: string, DATE: string) {
        return new Promise((resolve, reject) => {
            let SHOP_IDs = [];
            let uniquArr = [];
            this.dbService.getListReturnPromise_ArrayOfData('OrdersOfUser/' + USER_ID + '/' + DATE).then((data: any[]) => {
                console.log(data);
                SHOP_IDs = [];
                // Array.from(new Set(ORDERs_ID.map((item)=> item.app)))
                data.forEach(ORDER_ID => {
                    console.log(ORDER_ID);
                    let length = 'OrdersOfShop/'.length;
                    let ShopID = ORDER_ID.toString().substr(length, 20);
                    // console.log(ShopID);
                    SHOP_IDs.push(ShopID);
                })
                console.log(SHOP_IDs);
                if (SHOP_IDs.length > 0) {
                    uniquArr = this.appService.removeDuplicate(SHOP_IDs);
                    console.log(uniquArr);
                    resolve(uniquArr);
                } else {
                    reject({ message: 'there is no record', result: [] });
                }
            })
        })

    }

    getORDERS_IDOfUser(USER_ID: string, DATE: string) {
        let URL = 'OrdersOfUser/' + USER_ID + '/' + DATE;
        return this.dbService.getListReturnPromise_ArrayOfData(URL)
        // .then((ORDERs_ID)=>{
        //     console.log(ORDERs_ID);
        // })
    }

    getOrderDetailFromOrderIdURL(ORDER_URL) {
        this.dbService.getOneItemReturnPromise(ORDER_URL)
        // .then((orderDetail: iOrder)=>{
        //     console.log(orderDetail);
        // })
    }
}

export interface iPhoto {
    url: string,
    VISIBLE: boolean,
    NEW: boolean
}

/*
this service is used to hold local variables between pages
 */