import * as express from 'express';
import KahootModel from './kahoot.model';
import requireAuth from '@/middlewares/auth.middleware';
import status from 'http-status';
import { Response, CrudController, Controller } from '@shyn123/express-rest';
import { RequestWithUser } from '@/middlewares/auth.middleware';
import validate from './kahoot.validate';
class KahootController extends CrudController implements Controller {
  public path = '/kahoots';
  model = KahootModel;

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.post(this.path, requireAuth, validate, this.create);
    this.router.get(this.path, requireAuth, this.getAll);
    this.router.put(`${this.path}/:id`, requireAuth, validate, this.update);
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
  };
  getAll = async (req: RequestWithUser, res: express.Response) => {
    try {
      const { _id } = req.user;
      const data = await this.model
        .find({ userId: _id })
        .populate('questions')
        .lean();
      return Response(res, { data });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  getById = async (req: RequestWithUser, res: express.Response) => {
    try {
      const { _id } = req.user;
      const { id } = req.params;
      const data = await this.model
        .findOne({ _id: id, userId: _id })
        .populate('questions')
        .lean();
      if (!data) {
        return Response(
          res,
          {
            message: `${id} not found`
          },
          status.NOT_FOUND
        );
      }
      return Response(res, { data });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  create = async (req: RequestWithUser, res: express.Response) => {
    try {
      const { _id } = req.user;
      const data = new this.model({ ...req.body, userId: _id });
      await data.save();
      return Response(
        res,
        { message: 'Create completed', data },
        status.CREATED
      );
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  update = async (req: RequestWithUser, res: express.Response) => {
    try {
      const { _id } = req.user;
      const { id } = req.params;
      const data = await this.model
        .findOneAndUpdate(
          { _id: id, userId: _id },
          {
            $set: { ...req.body, userId: _id }
          },
          { new: true }
        )
        .populate('questions')
        .lean();
      if (!data) {
        return Response(res, { message: `${id} not found` }, status.NOT_FOUND);
      }
      return Response(res, { message: 'Edit completed', data }, status.OK);
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
}
export default KahootController;
