"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Express {
    constructor(appInit) {
        this.app = express_1.default();
        this.port = appInit.port;
        this.middlewares(appInit.middleWares);
        this.connectDatabase(appInit.databases);
        this.routes(appInit.controllers);
    }
    routes(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
    middlewares(middleWares) {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        middleWares.forEach((middleWare) => {
            this.app.use(middleWare);
        });
    }
    connectDatabase(databases) {
        databases.forEach((database) => {
            database.connect();
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is listening on port ${this.port}`);
        });
    }
}
exports.default = Express;
//# sourceMappingURL=Express.js.map