import Logger from "../../config/logger";
import Path = require("path");

export default class RegistrationService {

    private static instance: RegistrationService;

    static getInstance(): RegistrationService {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new RegistrationService();
        }

        return this.instance;
    }

    public userRegistration(dat, callback: Function): void {

        console.log("\n Registration service Request body :\n" + JSON.stringify(dat));
    }
    }
