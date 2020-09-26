import * as express from 'express';
import KahootModel from './kahoot.model';
import requireAuth from '@/middlewares/auth.middleware';
import status from 'http-status';
import { Response, CrudController, Controller } from '@shyn123/express-rest';
import { RequestWithUser } from '@/middlewares/auth.middleware';
class KahootController extends CrudController implements Controller {
  public path = '/kahoots';
  model = KahootModel;

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.post(this.path, requireAuth, this.create);
    this.router.get(this.path, requireAuth, this.getAll);
    this.router.put(`${this.path}/:id`, requireAuth, this.update);
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
  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id).populate('questions').lean();
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
}
export default KahootController;
