import 'module-alias/register';
require('dotenv').config();
import cors from 'cors';
import morgan from 'morgan';
import { Express, MongoDB } from '@shyn123/express-rest';
import AuthController from '@/modules/Auth/auth.controller';
import RoomController from '@/modules/Room/room.controller';
import KahootController from '@/modules/Kahoot/kahoot.controller';
import QuestionController from '@/modules/Question/question.controller';
import Swagger from '@/docs/config';
const MDW = [cors(), morgan('dev')];

const app = new Express({
  port: +process.env.PORT || 3000,
  middleWares: MDW,
  databaseConfigs: [
    {
      database: MongoDB,
      url: process.env.MONGO_URL
    }
  ],
  controllers: [
    new AuthController(),
    new RoomController(),
    new KahootController(),
    new QuestionController(),
    new Swagger()
  ]
});

const server = app.listen();
app.useSocket(require('socket.io')(server));
