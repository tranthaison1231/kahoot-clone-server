import express from "express";
import { Application } from "express";

class Express {
  public app: Application;
  public port: string | number;

  constructor(appInit: {
    port: string | number;
    databases: any;
    middleWares: any;
    controllers: any;
  }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.connectDatabase(appInit.databases);
    this.routes(appInit.controllers);
  }

  private routes(controllers: {
    forEach: (arg0: (controller: any) => void) => void;
  }): void {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void;
  }): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }
  private connectDatabase(databases: {
    forEach: (arg0: (databases: any) => void) => void;
  }): void {
    databases.forEach((database) => {
      database.connect();
    });
  }
  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}
export default Express;
