import cors from "cors";
import morgan from "morgan";
import Express from "./providers/Express";
import AuthController from "./modules/Auth/auth.controller";
const MDW = [cors(), morgan("dev")];

const app = new Express({
  port: 3000,
  middleWares: MDW,
  controllers: [new AuthController()]
});
app.listen();
