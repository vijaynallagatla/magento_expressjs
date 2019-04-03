import Logger from "../../config/logger";
import Path = require("path");

export default class StoreViewService {
    private static instance: StoreViewService;

    static getInstance(): StoreViewService {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new StoreViewService();
        }

        return this.instance;
    }
}