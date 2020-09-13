import * as express from "express";
import Controller from "../../interfaces/controller.interface"
import Auth from "./auth.interface"
import authModel from "./auth.model"

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();

  private auth = authModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(`${this.path}/login`, this.postLogin)
    this.router.get(`${this.path}/login`, this.postLogin) //test 
  }

  private postLogin = (
    req: express.Request,
    res: express.Response
  ) => {
    res.json({message: "Lam duoc roi"})
  }
}
export default AuthController;