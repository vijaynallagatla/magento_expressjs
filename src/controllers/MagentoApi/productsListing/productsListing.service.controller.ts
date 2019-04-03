import * as express from "express";
import { MagentoRoute } from "../../../config/constants";
import { DefaultLogger } from "../../../config/constants";
import { MagentoAPI } from "../magentoAPI_Request/requests";
let logger = require("winston");

export default class ProductsListingController {

	public static productsListing(req: express.Request, res: express.Response, next: Function): void {
		let products = function (store_code, type_id) {

			// REST call to Magento instance to fetch the products based on 
			MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/" + store_code + "/V1/categories")
				.then(function (categoryJSON) {
					let categoryID = JSON.parse(JSON.stringify(categoryJSON));
					categoryID = categoryID.id;

					// REST call to Magento instance to fetch products with same Category ID
					MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/categories/" + categoryID + "/products")
						.then(function (productsWithCategoryID) {

							// REST call to Magento instance to fetch all the products 
							MagentoAPI.get(MagentoRoute.MAGENTO_HOST + "/index.php/rest/" + store_code + "/V1/products?searchCriteria")
								.then(function (allProducts) {
									logger.debug("\nAll Products : \n " + JSON.stringify(allProducts));
									let product = ProductsListingController.filterProduct(allProducts, productsWithCategoryID, type_id);
									logger.debug("\nFiltered Product based on Category ID : \n" + JSON.stringify(product));
									res.json(product);
									res.end();
								})
								.catch(function (productError) {
									logger.debug("\n\nError in fetching Products with searchCriteria : ");
									logger.debug(productError);
								});
						})
						.catch(function (productError) {
							logger.debug("\n\nError in fetching Products with matching Category ID : ");
							logger.debug(productError);
						});
				})
				.catch(function (categoryError) {
					logger.debug("\nError in fetching Category ID : ");
					logger.debug(categoryError);
					res.write(categoryError);
					res.end();
				});
		};

		products(req.params.country_code, req.params.type_id);
	}

	private static filterProduct(allProductsJSON, productsWithCategoryID, type_id) {
		let product = {};
		// tslint:disable-next-line:all quotemark
		let items = "items";
		product[items] = [];

		let filteredSKU = JSON.parse(JSON.stringify(productsWithCategoryID));
		let filteredProd = JSON.parse(JSON.stringify(allProductsJSON));

		logger.debug("\n\n No products based on category ID : " + filteredSKU.length);

		for (let k = 0; k < filteredSKU.length; k++) {
			for (let i = 0; i < filteredProd.items.length; i++) {
				// let id, name, sku, price, custome_attributes;
				if (filteredSKU[k].sku === filteredProd.items[i].sku && filteredProd.items[i].type_id === type_id) {
					logger.debug(type_id + " Product Listing");
					let item = {
						"id": filteredProd.items[i].id,
						"name": filteredProd.items[i].name,
						"sku": filteredProd.items[i].sku,
						"price": filteredProd.items[i].price,
						"custom_attributes": filteredProd.items[i].custom_attributes
					};
					product[items].push(item);
					logger.debug(item);
				}
				else if (filteredSKU[k].sku === filteredProd.items[i].sku && type_id === "default") {
					logger.debug("Default Product Listing");
					let item = {
						"id": filteredProd.items[i].id,
						"name": filteredProd.items[i].name,
						"sku": filteredProd.items[i].sku,
						"price": filteredProd.items[i].price,
						"custom_attributes": filteredProd.items[i].custom_attributes
					};
					product[items].push(item);
				}
			}
		}
		return (product);
	}
}