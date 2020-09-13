import Express from './providers/Express';
import AuthController from "./modules/Auth/auth.controller";

const app = new Express({
  port : 3000,
  controllers: [new AuthController()]
})
app.listen();