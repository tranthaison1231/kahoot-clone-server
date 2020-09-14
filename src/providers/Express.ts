// import * as express from "express";
import express from 'express';
import { Application } from 'express';
import logger from '@/ultis/logger';

interface Controllers {
  forEach: (arg0: (controller: any) => void) => void;
}

class Express {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; controllers: Controllers }) {
    this.app = express();
    this.port = appInit.port;

    this.routes(appInit.controllers);
  }

  private routes(controllers: Controllers): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger({
        type: 'Success',
        message: `Server is listening on http://localhost:${this.port}`,
      });
    });
  }
}
export default Express;
