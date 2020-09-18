import 'module-alias/register';
require('dotenv').config();
import cors from 'cors';
import morgan from 'morgan';
import Express from '@/providers/Express';
import AuthController from '@/modules/Auth/auth.controller';
import KahootController from '@/modules/Kahoot/kahoot.controller';
import QuestionController from '@/modules/Question/question.controller';
import MongoDB from '@/db/mongoDB';

const MDW = [cors(), morgan('dev')];

const app = new Express({
  port: +process.env.PORT || 3000,
  middleWares: MDW,
  databases: [MongoDB],
  controllers: [
    new KahootController(),
    new AuthController(),
    new QuestionController()
  ]
});
app.listen();
