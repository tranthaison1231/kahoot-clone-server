import status from 'http-status';
import * as express from 'express';
import QuestionModel from './question.model';
import KahootModel from '@/modules/Kahoot/kahoot.model';
import Response from '@/helpers/response.helper';
import CrudController from '@/modules/Common/crudController';
import requireAuth from '@/middlewares/auth.middleware';
import Controller from '@/interfaces/controller.interface';

class QuestionController extends CrudController implements Controller {
  public path = '/kahoots/:kahootId/questions';
  model = QuestionModel;
  private kahoot = KahootModel;
  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, requireAuth, this.postQuestion);
    this.router.get(this.path, requireAuth, this.getAll);
    this.router.put(`${this.path}/:id`, requireAuth, this.update);
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
  };
  private postQuestion = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { kahootId } = req.params;
      const data = new this.model(req.body);
      data.save();
      await this.kahoot.findOneAndUpdate(
        { _id: kahootId },
        { $push: { questions: data._id } },
        { new: true }
      );
      return Response(
        res,
        { message: 'Create completed', data },
        status.CREATED
      );
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
}
export default QuestionController;
