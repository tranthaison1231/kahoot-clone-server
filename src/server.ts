import 'module-alias/register';
require('dotenv').config();
import cors from 'cors';
import morgan from 'morgan';
import { Express } from '@shyn123/express-rest';
import AuthController from '@/modules/Auth/auth.controller';
import MongoDB from './db/mongoDB';

const MDW = [cors(), morgan('dev')];

const app = new Express({
  port: +process.env.PORT || 3000,
  middleWares: MDW,
  databases: [MongoDB],
  controllers: [new AuthController()],
});
app.listen();
