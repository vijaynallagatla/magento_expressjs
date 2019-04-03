import * as http from "http";
import * as express from "express";

import config from "./config/express";
import ApplicationRouter from "./routes/application.route";
import Logger from "./config/logger";

let hostname = "0.0.0.0";
let defaultPort = "8080";

export default class Application {

    app: express.Express;
    server: http.Server;
    port: string;

    constructor() {
        this.app = config(express());

        this.server = http.createServer(this.app);

        this.routes();

        this.start(this.server);

    }

    public static bootstrap(): Application {
        return new Application();
    }

    private routes(): void {
        let router: express.Router = express.Router();
        ApplicationRouter.create(router);
        this.app.use(router);
    }

    public start(server) {
        this.port = defaultPort;

        server.listen(this.port, "0.0.0.0");

        server.on("error", (e: Error) => {
            Logger.Instance.error("error starting server!", e.message);
        });

        server.on("listening", () => {
            console.log("Server started on http://" + hostname + ":" + this.port);
            Logger.Instance.info("Server started on http://" + hostname + ":" + this.port);
        });

    }
}

let app = new Application();
