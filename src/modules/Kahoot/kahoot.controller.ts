import Controller from '@/interfaces/controller.interface';
import requireAuth from '@/middlewares/auth.middleware';
import CrudController from '@/modules/crudController';
import * as express from 'express';
import kahootModel from './kahoot.model';

class KahootController extends CrudController implements Controller {
  public router = express.Router();
  model = kahootModel;
  path = '/kahoots';
  controllerName = 'kahoot';

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.post(this.path, requireAuth, this.post.bind(this));
    this.router.get(this.path, requireAuth, this.getAll.bind(this));
    this.router.put(`${this.path}/:id`, requireAuth, this.update.bind(this));
    this.router.get(`${this.path}/:id`, requireAuth, this.getById.bind(this));
    this.router.delete(
      `${this.path}/:id`,
      requireAuth,
      this.deleteById.bind(this)
    );
  };
}
export default KahootController;
