import status from 'http-status';
import * as express from 'express';
import questionModel from './question.model';
import Response from '@/helpers/response.helper';
import CrudController from '@/modules/crudController';
import requireAuth from '@/middlewares/auth.middleware';
import Controller from '@/interfaces/controller.interface';

class QuestionController extends CrudController implements Controller {
  public path = '/kahoots/:kahootId/questions';
  model = questionModel;
  controllerName = 'question';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, requireAuth, this.post.bind(this));
    this.router.get(this.path, requireAuth, this.getQuestions);
    this.router.put(`${this.path}/:id`, requireAuth, this.update.bind(this));
    this.router.get(`${this.path}/:id`, requireAuth, this.getById.bind(this));
    this.router.delete(
      `${this.path}/:id`,
      requireAuth,
      this.deleteById.bind(this)
    );
  };

  private getQuestions = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { kahootId } = req.params;
    const questions = await this.model.find({ kahootId }).lean();
    if (!questions.length) {
      return Response(
        res,
        { message: 'Questions not found' },
        status.NOT_FOUND
      );
    }
    Response(res, { questions });
  };
}
export default QuestionController;
