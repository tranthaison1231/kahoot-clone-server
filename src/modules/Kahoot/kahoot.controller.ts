import * as express from "express";
import Controller from "@/interfaces/controller.interface";
import Kahoot from "./kahoot.interface";
import kahootModel from "./kahoot.model";
import Response from "@/helpers/response.helper";
import mongoose from "mongoose";

class KahootController implements Controller {
  public path = "/kahoots";
  public router = express.Router();
  private kahoot = kahootModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, this.postKahoot);
    this.router.get(this.path, this.getKahoots);
  };

  private postKahoot = async (req: express.Request, res: express.Response) => {
    const { userId, title, type }: Kahoot = req.body;
    const newKahoot = new this.kahoot({
      userId: mongoose.Types.ObjectId(userId),
      title,
      type
    });
    await newKahoot.save();
    return Response.success(res, { kahoot: newKahoot }, 201);
  };

  private getKahoots = async (req: express.Request, res: express.Response) => {
    const kahoots = await this.kahoot.find();
    Response.success(res, { kahoots }, 201);
  };
}
export default KahootController;
