import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Controller from "@/interfaces/controller.interface";
import { Login, Register } from "./auth.interface";
import authModel from "./auth.model";
import Response from "@/helpers/response.helper";
import { ONE_HOUR } from "@/constant";
import requireAuth from "@/middlewares/auth.middleware";
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
    this.router.post(`${this.path}/register`, requireAuth, this.Register);
  }

  private Login = async (req: express.Request, res: express.Response) => {
    const { username, password }: Login = req.body;
    const user = await this.auth.findOne({ username });
    if (!user) {
      return Response.error(res, { message: "User name does not exist" }, 403);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password + "",
      user.password
    );
    if (!isPasswordCorrect) {
      return Response.error(res, { message: "Wrong password" }, 403);
    }
    const payload = {
      username,
      userId: user._id,
      exp: Date.now() + ONE_HOUR
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return Response.success(res, { accessToken }, 201);
  };

  private Register = async (req: express.Request, res: express.Response) => {
    const { username, password, confirmPassword }: Register = req.body;

    const user = await this.auth.findOne({ username });
    if (user) {
      return Response.error(res, { message: "Username has been used" }, 403);
    }
    if (password !== confirmPassword) {
      return Response.error(res, { message: "Password not matched" }, 403);
    }
    const hashPassword = await bcrypt.hash(password, this.salt);
    const newUser = new this.auth({
      username,
      password: hashPassword
    });
    await newUser.save();
    return Response.success(res, { user: newUser }, 201);
  };
}
export default AuthController;
