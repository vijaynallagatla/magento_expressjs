export class MagentoRoute {
    static MAGENTO_HOST: string = "http://10.71.11.175";
    static MAGENTO_PORT: number = 80;
    static MAGENTO_AUTH_TOKEN = "9a0e4n14arc1otkmxcbuunmd09r0uopu";
}

export class Action {
    static START: string = "START";
    static STOP: string = "STOP";
}

export class ApiBasePath {
    static REGISTRATION_PATH: string = "/api/v1/magento";
    static PRODUCTS: string = "/api/:country_code/v1/magento/products/:type_id";
    static ADD_PRODUCT_CART: string = "/api/v1/magento/cart/:emailID/add/:sku/:quantity";
    static LIST_PRODUCT_CART: string = "/api/v1/magento/cart/:emailID/list";
    static DELETE_PRODUCT_CART: string = "/api/v1/magento/cart/:emailID/delete/:sku";
}

export class DefaultLogger {
    static LOG_LEVEL: string = "debug";
}
