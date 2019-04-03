import * as express from "express";
import { MagentoRoute } from "../../../config/constants";
import { MagentoAPI } from "../magentoAPI_Request/requests";
import { DefaultLogger } from "../../../config/constants";
let log4js = require("log4js");
let logger = log4js.getLogger();
logger.level = DefaultLogger.LOG_LEVEL;

export class UserInfo {

    public static getCustomerID(emailID: string) {

        MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=email&searchCriteria[filter_groups][0][filters][0][value]=" + emailID + "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq")
            .then(function (customer_info) {
                logger.debug(JSON.stringify(customer_info));
                return customer_info["items"][0].id;
            })
            .catch(function (error) {
                logger.debug("Error in searching for Customer with Email ID :" + emailID);
                return (-1);
            });
    }

    public static getCustomerCartID(customerID: number) {
        return "";
    }
}