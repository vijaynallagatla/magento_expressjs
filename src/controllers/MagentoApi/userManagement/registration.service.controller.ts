import * as express from "express";
import RegistrationService from "../../../services/magentoApi/UserRegistrationService";

export default class RegistrationController {

    public static registration(req: express.Request, res: express.Response, next: Function): void {

        let data = req.body;

        console.log("Registration Request");
        RegistrationService.getInstance().userRegistration(req.body, function (err, dat) {
            if (err) {
                res.send(err);
                res.end();
                console.log("Registration error : ", err);
                return;
            }
            
            let grpcStatusCode = dat.status_code;

            if (grpcStatusCode === 200) {
                res.status(200).json(dat.response);
                console.log("Registration Successful !!! " + dat.status_code + " \n Response :\n ", JSON.stringify(dat.response));
            } else {
                let message = {
                    message: dat.message
                };
                res.status(422).json(message);
                console.log("Registration Failed !!! " + dat.status_code + " \n Response :\n ", JSON.stringify(dat.message));
            }
            res.end();
        });
    }
}