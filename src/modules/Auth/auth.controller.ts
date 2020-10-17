import { Controller, Response as HttpResponse } from '@shyn123/express-rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import status from 'http-status';
import UserModel from './user.model';
import { EXPIRED_TIME } from '@/constant';
import { Login, Register } from './auth.interface';
import express, { Request, Response } from 'express';
import validate from '@/middlewares/validate.middleware';
import { loginSchema, registerSchema } from './auth.validate';

class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private user = UserModel;
  private salt: number = 10;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(`${this.path}/login`, validate(loginSchema), this.login);
    this.router.post(
      `${this.path}/register`,
      validate(registerSchema),
      this.register
    );
  };

  private login = async (req: Request, res: Response) => {
    const { username, password }: Login = req.body;
    const user = await this.user.findOne({ username });
    if (!user) {
      return HttpResponse(
        res,
        { message: 'User name does not exist' },
        status.BAD_REQUEST
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      password.toString(),
      user.password
    );
    if (!isPasswordCorrect) {
      return HttpResponse(
        res,
        { message: 'Wrong password' },
        status.BAD_REQUEST
      );
    }
    const payload = {
      username,
      userId: user._id,
      exp: Date.now() + EXPIRED_TIME
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return HttpResponse(
      res,
      { message: 'Login completed', accessToken },
      status.CREATED
    );
  };

  private register = async (req: Request, res: Response) => {
    const { username, password, confirmPassword }: Register = req.body;

    const user = await this.user.findOne({ username });
    if (user) {
      return HttpResponse(
        res,
        { message: 'Username has been used' },
        status.BAD_REQUEST
      );
    }
    if (password !== confirmPassword) {
      return HttpResponse(
        res,
        { message: 'Password not matched' },
        status.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(password, this.salt);
    const newUser = new this.user({
      username,
      password: hashPassword
    });
    await newUser.save();
    const payload = {
      username,
      userId: newUser._id,
      exp: Date.now() + EXPIRED_TIME
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return HttpResponse(
      res,
      { message: 'Register completed', accessToken },
      status.CREATED
    );
  };
}
export default AuthController;
