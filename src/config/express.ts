import * as bodyParser from "body-parser";
import * as express from "express";

export default function config(app: express.Express) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // cors support
    app.use((req, res, next): void => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        next();
    });

    // production error handler
    app.use((err: any, req: express.Request, res: express.Response, next): void => {
        res.status(err.status || 404).render("error", {
            message: err.message,
            error: {}
        });
    });

    if (app.get("env") === "development") {
        app.use((err: Error, req: express.Request, res: express.Response, next): void => {
            res.status(404).render("error", {
                message: err.message,
                error: err
            });
        });
    }

    return app;
}