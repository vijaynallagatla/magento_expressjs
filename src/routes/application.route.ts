import * as express from "express";

// import RegistrationController from "../controllers/MagentoApi/userManagement/registration.service.controller";
import ProductsListingController from "../controllers/MagentoApi/productsListing/productsListing.service.controller";
import UserCartController from "../controllers/MagentoApi/cart/userCart.service.controller";
import { ApiBasePath } from "../config/constants";
import RegistrationController from "../controllers/MagentoApi/userManagement/registration.service.controller";

export default class ApplicationRouter {
  public static create(router: express.Router) {

    router.post(ApiBasePath.REGISTRATION_PATH + "/registration/customer", RegistrationController.registration);
    // Magento Products API
    router.get(ApiBasePath.PRODUCTS, ProductsListingController.productsListing);

    // Magento Cart and Checkout
    router.put(ApiBasePath.ADD_PRODUCT_CART, UserCartController.addItemToCart);

    router.get(ApiBasePath.LIST_PRODUCT_CART, UserCartController.listItemsFromCart);
    router.get(ApiBasePath.DELETE_PRODUCT_CART, UserCartController.deleteItemFromCart);
  }
}
