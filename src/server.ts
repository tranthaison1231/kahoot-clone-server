import Express from './providers/Express';
import * as express from "express"
import AuthController from "./modules/Auth/auth.controller";
import cors from "cors";
import morgan from "morgan"
const MDW = [
  cors(),
  morgan("dev")
];

const app = new Express({
  port : 3000,
  middleWares: MDW,
  controllers: [new AuthController()]
})
app.listen();