import * as express from "express";
import Controller from "@/interfaces/controller.interface";
import Kahoot from "./kahoot.interface";
import kahootModel from "./kahoot.model";
import Response from "@/helpers/response.helper";
import mongoose from "mongoose";
import status from "http-status";

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
    return Response(
      res,
      { message: "Create completed", kahoot: newKahoot },
      status.CREATED
    );
  };
  private getKahoots = async (req: express.Request, res: express.Response) => {
    const kahoots = await this.kahoot.find();
    if (!kahoots.length) {
      return Response(res, { message: "Kahoots not found" }, status.NOT_FOUND);
    }
    Response(res, { kahoots });
  };
  private getKahoot = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const kahoot = await this.kahoot.findById(id);
    if (!kahoot) {
      return Response(res, { message: "Kahoot not found" }, status.NOT_FOUND);
    }
    Response(res, { kahoot });
  };
  private deleteKahoot = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { id } = req.params;
    const kahoot = await this.kahoot.findByIdAndDelete(id);
    if (!kahoot) {
      return Response(res, { message: "Kahoot not found" }, status.NOT_FOUND);
    }
    Response(res, { message: "Delete completed", kahoot }, status.CREATED);
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
      return Response(res, { message: "Kahoot not found" }, status.NOT_FOUND);
    }
    return Response(
      res,
      { message: "Edit completed", kahoot: newKahoot },
      status.CREATED
    );
  };
}
export default KahootController;
