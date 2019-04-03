import * as express from "express";
import { MagentoRoute } from "../../../config/constants";
import { MagentoAPI } from "../magentoAPI_Request/requests";
import * as logger from "winston";

export default class UserCartController {

    public static addItemToCart(req: express.Request, res: express.Response, next: Function): void {

        logger.debug("\n Magento API : ", req.url);

        // Rest call to Magento to get the Customer ID with searchCriteria = email ID
        MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=email&searchCriteria[filter_groups][0][filters][0][value]=" + req.params.emailID + "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq")
            .then(function (customer_info) {
                logger.debug(JSON.stringify(customer_info), "USERCART");
                let customer_id = customer_info["items"][0].id;

                // REST call to Magento to get the cart ID with SearchCriteria = Customer ID
                MagentoAPI.post(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/customers/" + customer_id + "/carts", "")
                    .then(function (cart_id) {

                        // REST call Magento to get the Product details
                        MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/products/" + req.params.sku)
                            .then(function (product_detail) {
                                let obj = JSON.parse(JSON.stringify(product_detail));
                                let type_id = obj.type_id;

                                logger.debug("\n\n\nProduct : " + JSON.stringify(obj.extension_attributes));

                                logger.debug("Product Type : " + type_id);
                                switch (type_id) {
                                    case "simple": logger.debug("Adding Simple Product into Cart \n");
                                        break;

                                    case "bundle": logger.debug("Adding Bundle Product into Cart \n");

                                        let extension_attributes = {};
                                        let bundle = [];
                                        //   let bundle_options = ;
                                        let bundle_product_options = obj.extension_attributes["bundle_product_options"];

                                        logger.debug("Bundle Options size :" + bundle_product_options);
                                        for (let i = 0; i < bundle_product_options.length; i++) {
                                            let option_id: number = bundle_product_options[i].option_id;
                                            let option_qty: number = bundle_product_options[i].product_links[0].qty;
                                            let option_selections: number = bundle_product_options[i].product_links[0].id;
                                            logger.debug("Option ID : " + option_id + "\nOption Qty : " + option_qty + "\nOption selection : " + option_selections);

                                            let option = {
                                                "option_id": option_id,
                                                "option_qty": option_qty,
                                                "option_selections": [option_selections]
                                            };
                                            bundle.push(option);
                                        }
                                        let cartItem = {
                                            "cartItem": {
                                                "sku": req.params.sku,
                                                "qty": req.params.quantity,
                                                "quote_id": cart_id,
                                                "product_option": {
                                                    "extension_attributes": {
                                                        "bundle_options": bundle
                                                    }
                                                }
                                            }
                                        };

                                        MagentoAPI.post(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/carts/" + cart_id + "/items", cartItem)
                                            .then(function (product_in_cart) {
                                                res.json(product_in_cart);
                                                res.end();
                                            })
                                            .catch(function (adding_product_to_cart_error) {
                                                res.json(adding_product_to_cart_error);
                                                res.end();
                                            });
                                        break;
                                }

                            })
                            .catch(function (product_details_error) {
                                res.json(product_details_error);
                                res.end();
                            });
                    })
                    .catch(function (cart_id_Error) {
                        res.json(cart_id_Error);
                        res.end();
                    });
            })
            .catch(function (error) {
                logger.debug("Error in searching for Customer with Email ID :" + req.params.emailID);
                res.json(error);
                res.end();
            });
    }


    public static listItemsFromCart(req: express.Request, res: express.Response, next: Function): void {

        // Rest call to Magento to get the Customer ID with searchCriteria = email ID
        MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=email&searchCriteria[filter_groups][0][filters][0][value]=" + req.params.emailID + "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq")
            .then(function (customer_info) {
                let customer_id = customer_info["items"][0].id;

                // REST call to Magento to get the cart ID with SearchCriteria = Customer ID
                MagentoAPI.post(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/customers/" + customer_id + "/carts", "")
                    .then(function (cart_id) {
                        MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/carts/" + cart_id + "/items")
                            .then(function (itemsList) {
                                res.json(itemsList);
                                res.end();
                            })
                            .catch(function (Exception) {
                                res.write("{}");
                                res.end();
                            });
                    })
                    .catch(function (cart_id_Error) {
                        res.json(cart_id_Error);
                        res.end();
                    });
            })
            .catch(function (error) {
                res.json(error);
                res.end();
            });
    }

    public static deleteItemFromCart(req: express.Request, res: express.Response, next: Function): void {

        // Rest call to Magento to get the Customer ID with searchCriteria = email ID
        MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=email&searchCriteria[filter_groups][0][filters][0][value]=" + req.params.emailID + "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq")
            .then(function (customer_info) {
                let customer_id = customer_info["items"][0].id;

                // REST call to Magento to get the cart ID with SearchCriteria = Customer ID
                MagentoAPI.post(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/customers/" + customer_id + "/carts", "")
                    .then(function (cart_id) {
                        // logger.debug(cart_id);
                        MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/carts/" + cart_id + "/items")
                            .then(function (itemsList) {
                                res.json(itemsList);
                                res.end();
                            })
                            .catch(function (Exception) {
                                res.write("{}");
                                res.end();
                            });
                    })
                    .catch(function (cart_id_Error) {
                        res.json(cart_id_Error);
                        res.end();
                    });
            })
            .catch(function (error) {
                res.json(error);
                res.end();
            });
    }
}