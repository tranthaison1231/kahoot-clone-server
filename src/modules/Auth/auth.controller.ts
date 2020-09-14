import * as express from "express";
import Controller from "../../interfaces/controller.interface";
import { Login } from "./auth.interface";
import authModel from "./auth.model";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();

  private auth = authModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.Login);
  }

  private Login = (req: express.Request, res: express.Response) => {
    const { username, password }: Login = req.body;
    res.json({ username, password });
  };
}
export default AuthController;
