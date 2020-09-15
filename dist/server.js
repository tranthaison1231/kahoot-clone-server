"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const Express_1 = __importDefault(require("./providers/Express"));
const auth_controller_1 = __importDefault(require("./modules/Auth/auth.controller"));
const mongoDB_1 = __importDefault(require("./db/mongoDB"));
const MDW = [cors_1.default(), morgan_1.default("dev")];
const app = new Express_1.default({
    port: process.env.PORT || 3000,
    middleWares: MDW,
    databases: [mongoDB_1.default],
    controllers: [new auth_controller_1.default()]
});
app.listen();
//# sourceMappingURL=server.js.map