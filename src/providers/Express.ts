// import * as express from "express";
import express = require("express");
import { Application } from "express";
import logger from "../ultis/logger";

class Express {
  public app: Application;
  public port: number;

  constructor(appInit: {
    port: number;
    // databases: any;
    // middleWares: any;
    controllers: any;
  }){
    this.app = express();
    this.port = appInit.port;

    this.routes(appInit.controllers);
  }

  private routes(controllers: {
    forEach: (arg0: (controller: any) => void) => void;
  }): void {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger({ type: 'Info', message: `server is listening on ${this.port}` });
    });
  }
}
export default Express;