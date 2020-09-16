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
    this.router.get(this.path, this.getKahoots);
    this.router.post(this.path, this.postKahoot);
    this.router.get(`${this.path}/:id`, this.getKahoot);
    this.router.delete(`${this.path}/:id`, this.deleteKahoot);
    this.router.put(`${this.path}/:id`, this.putKahoot);
  };

  private postKahoot = async (req: express.Request, res: express.Response) => {
    const { userId, title, type }: Kahoot = req.body;
    const newKahoot = new this.kahoot({
      userId: mongoose.Types.ObjectId(userId),
      title,
      type
    });
    await newKahoot.save();
    return Response.success(
      res,
      { message: "Create completed", kahoot: newKahoot },
      201
    );
  };

  private getKahoots = async (req: express.Request, res: express.Response) => {
    const kahoots = await this.kahoot.find();
    Response.success(res, { kahoots }, 201);
  };
  private getKahoot = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const kahoot = await this.kahoot.findById(id);
    if (!kahoot) {
      return Response.error(res, { message: "Kahoot not found" }, 404);
    }
    Response.success(res, { kahoot }, 201);
  };
  private deleteKahoot = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { id } = req.params;
    const kahoot = await this.kahoot.findByIdAndDelete(id);
    if (!kahoot) {
      return Response.error(res, { message: "Kahoot not found" }, 404);
    }
    Response.success(res, { message: "Delete completed", kahoot }, 201);
  };
  private putKahoot = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { userId, title, type }: Kahoot = req.body;
    const newKahoot = await this.kahoot.findOneAndUpdate(
      { _id: id },
      {
        $set: { userId, title, type }
      },
      { new: true }
    );
    if (!newKahoot) {
      return Response.error(res, { message: "Kahoot not found" }, 404);
    }
    return Response.success(
      res,
      { message: "Edit completed", kahoot: newKahoot },
      201
    );
  };
}
export default KahootController;
