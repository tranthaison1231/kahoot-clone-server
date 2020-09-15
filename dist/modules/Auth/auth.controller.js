"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const bcrypt = __importStar(require("bcrypt"));
const auth_model_1 = __importDefault(require("./auth.model"));
const response_helper_1 = __importDefault(require("../../helpers/response.helper"));
class AuthController {
    constructor() {
        this.path = "/auth";
        this.router = express.Router();
        this.auth = auth_model_1.default;
        this.saltRounds = 10;
        this.Login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const user = yield this.auth.findOne({ username });
            if (!user) {
                return response_helper_1.default.error(res, { message: "User name does not exist" }, 403);
            }
            console.log(password, typeof password, user.password, typeof user.password);
            const isPasswordCorrect = yield bcrypt.compare(password + "", user.password);
            if (!isPasswordCorrect) {
                return response_helper_1.default.error(res, { message: "Wrong password" }, 403);
            }
            return response_helper_1.default.success(res, { user }, 201);
        });
        this.Register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password, confirmPassword } = req.body;
            const user = yield this.auth.findOne({ username });
            if (user) {
                return response_helper_1.default.error(res, { message: "Username has been used" }, 403);
            }
            if (password !== confirmPassword) {
                return response_helper_1.default.error(res, { message: "Password not matched" }, 403);
            }
            const hashPassword = yield bcrypt.hash(password, this.saltRounds);
            const newUser = new this.auth({
                username,
                password: hashPassword
            });
            yield newUser.save();
            return response_helper_1.default.success(res, { user: newUser }, 201);
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/login`, this.Login);
        this.router.post(`${this.path}/register`, this.Register);
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map