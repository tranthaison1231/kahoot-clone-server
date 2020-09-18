import * as express from 'express';
import Controller from '@/interfaces/controller.interface';
import Kahoot from './kahoot.interface';
import kahootModel from './kahoot.model';
import Response from '@/helpers/response.helper';
import mongoose from 'mongoose';
import status from 'http-status';
import requireAuth from '@/middlewares/auth.middleware';

class KahootController implements Controller {
  public path = '/kahoots';
  public router = express.Router();
  private kahoot = kahootModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, requireAuth, this.post);
    this.router.get(this.path, requireAuth, this.getAll);
    this.router.put(`${this.path}/:id`, requireAuth, this.update);
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
  };

  private post = async (req: express.Request, res: express.Response) => {
    const { userId, title }: Kahoot = req.body;
    const newKahoot = new this.kahoot({
      userId: mongoose.Types.ObjectId(userId),
      title
    });
    await newKahoot.save();
    return Response(
      res,
      { message: 'Create completed', kahoot: newKahoot },
      status.CREATED
    );
  };
  private getAll = async (req: express.Request, res: express.Response) => {
    const kahoots = await this.kahoot.find().lean();
    if (!kahoots.length) {
      return Response(res, { message: 'Kahoots not found' }, status.NOT_FOUND);
    }
    Response(res, { kahoots });
  };
  private getById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const kahoot = await this.kahoot.findById(id).lean();
    if (!kahoot) {
      return Response(res, { message: 'Kahoot not found' }, status.NOT_FOUND);
    }
    Response(res, { kahoot });
  };
  private deleteById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const kahoot = await this.kahoot.findByIdAndDelete(id).lean();
    if (!kahoot) {
      return Response(res, { message: 'Kahoot not found' }, status.NOT_FOUND);
    }
    Response(res, { message: 'Delete completed', kahoot }, status.CREATED);
  };
  private update = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { userId, title }: Kahoot = req.body;
    const newKahoot = await this.kahoot
      .findOneAndUpdate(
        { _id: id },
        {
          $set: { userId, title }
        },
        { new: true }
      )
      .lean();
    if (!newKahoot) {
      return Response(res, { message: 'Kahoot not found' }, status.NOT_FOUND);
    }
    return Response(
      res,
      { message: 'Edit completed', kahoot: newKahoot },
      status.CREATED
    );
  };
}
export default KahootController;
