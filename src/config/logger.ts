import winston = require("winston");

let path = require("path");
let winston_dailly_rotate = require("winston-daily-rotate-file");
const tsFormat = () => (new Date()).toLocaleString();


let transport = new winston.transports.DailyRotateFile({
    timestamp: tsFormat,
    localTime: true,
    name: "file",
    datePattern: "yyyy-MM-ddTHH",
    filename: "-api.log",
    maxDays: 1,
    colorize: true,
    prepend: true,
    createTree: true
});

let transportConsole = new winston.transports.Console({
    colorize: true,
    prettyPrint: true,
    timestamp: tsFormat
});

export default class Logger {
    private static logger: winston.LoggerInstance;

    private constructor() {
    }

    static get Instance() {
        if (this.logger === null || this.logger === undefined) {
            this.logger = new (winston.Logger)({
                transports: [
                    // transport,
                    transportConsole
                ]
            });
        }

        return this.logger;
    }
}