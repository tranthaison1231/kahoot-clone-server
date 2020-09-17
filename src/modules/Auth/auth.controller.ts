import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import status from "http-status";
import Controller from "@/interfaces/controller.interface";
import { Login, Register } from "./auth.interface";
import authModel from "./auth.model";
import Response from "@/helpers/response.helper";
import { EXPIRED_TIME } from "@/constant";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private auth = authModel;
  private salt: number = 10;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.Login);
    this.router.post(`${this.path}/register`, this.Register);
  }

  private Login = async (req: express.Request, res: express.Response) => {
    const { username, password }: Login = req.body;
    const user = await this.auth.findOne({ username });
    if (!user) {
      return Response(
        res,
        { message: "User name does not exist" },
        status.FORBIDDEN
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      password + "",
      user.password
    );
    if (!isPasswordCorrect) {
      return Response(res, { message: "Wrong password" }, status.FORBIDDEN);
    }
    const payload = {
      username,
      userId: user._id,
      exp: Date.now() + EXPIRED_TIME
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return Response(
      res,
      { message: "Login completed", accessToken },
      status.OK
    );
  };

  private Register = async (req: express.Request, res: express.Response) => {
    const { username, password, confirmPassword }: Register = req.body;

    const user = await this.auth.findOne({ username });
    if (user) {
      return Response(
        res,
        { message: "Username has been used" },
        status.CONFLICT
      );
    }
    if (password !== confirmPassword) {
      return Response(
        res,
        { message: "Password not matched" },
        status.CONFLICT
      );
    }
    const hashPassword = await bcrypt.hash(password, this.salt);
    const newUser = new this.auth({
      username,
      password: hashPassword
    });
    await newUser.save();
    return Response(res, { user: newUser }, status.CREATED);
  };
}
export default AuthController;
