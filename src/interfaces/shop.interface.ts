import { iPosition } from './position.interface';

export interface iShop {
    SHOP_ID: string,
    SHOP_OWNER: string,
    SHOP_DATE_CREATE: string,
    SHOP_LOCATION: iPosition,
    SHOP_NAME: string,
    SHOP_KIND: string,
    SHOP_ADDRESS: string,
    SHOP_IMAGES: string[],
    SHOP_PHONE?: string,
    SHOP_isCREDIT: boolean,
    SHOP_isMOTO_PARK_FREE: boolean,
    SHOP_isCAR_PARK_FREE: boolean,
    SHOP_isMEMBERSHIP: boolean,
    SHOP_isVISIBLE: boolean,
    SHOP_CURRENCY: string,
    SHOP_TABLES: string[],
    SHOP_OTHER: any

}