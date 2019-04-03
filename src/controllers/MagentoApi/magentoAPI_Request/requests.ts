import * as express from "express";
import { MagentoRoute } from "../../../config/constants";
let request = require("request");
import { DefaultLogger } from "../../../config/constants";
let logger = require("winston");
let promise = require("promise");

logger.level = DefaultLogger.LOG_LEVEL;

export class MagentoAPI {

    public static get(api: string) {

        return new Promise(
            function (resolve, reject) {
                // logger.debug("Promise");
                let options = {
                    method: "GET",
                    url: api,
                    json: true,
                    auth: {
                        "timeout": 1000,
                        "bearer": MagentoRoute.MAGENTO_AUTH_TOKEN
                    }
                };

                request(options, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        logger.debug("\n Magento REST call Successful for : " + api);
                        logger.debug(JSON.stringify(body));
                        resolve(body);
                    } else {
                        logger.debug("\n Magento REST call Failed for : " + api);
                        logger.debug(body);
                        reject("Magento REST call failed : " + api);
                    }
                });
            }
        );
    }


    public static post(api: string, body: any) {

        return new Promise(
            function (resolve, reject) {
                // logger.debug("Promise");
                let options = {
                    method: "POST",
                    url: api,
                    body: body,
                    json: true,
                    auth: {
                        "timeout": 3000,
                        "bearer": MagentoRoute.MAGENTO_AUTH_TOKEN
                    }
                };

                request(options, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        logger.debug("\n Magento REST call Successful for : " + api);
                        // logger.debug(body);
                        
                        resolve(body);

                    } else {
                        logger.debug("\n Magento REST call Failed for : " + api);
                        logger.debug(body);
                        reject(body);
                    }
                });
            }
        );
    }
}