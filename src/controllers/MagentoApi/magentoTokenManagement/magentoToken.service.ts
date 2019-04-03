import { MagentoRoute } from "../../../config/constants";
import { MagentoAPI } from "../magentoAPI_Request/requests";

export default class MagentoTokenManagement {

    public static getAdminToken(username: string, password: string) {
        return this.getToken("user", "bitnami1", "admin");
    }

    public static getCustomerToken(username: string, password: string) {
        return this.getToken(username, password, "customer");
    }

    public static getToken(username: string, password: string, role: string) {
        console.log("\n\nGetting Admin Token : ");
        let body = {
            "username" : username,
            "password" : password
        };
        MagentoAPI.post(MagentoRoute.MAGENTO_HOST + "/index.php/rest/V1/integration/" + role + "/token", body)
        .then(function (token){
            return token;
        })
        .catch(function (exception){
            return exception;
        });
    }
}