import status from 'http-status';
import * as express from 'express';
import QuestionModel from './question.model';
import KahootModel from '@/modules/Kahoot/kahoot.model';
import { Response, CrudController, Controller } from '@shyn123/express-rest';
import requireAuth from '@/middlewares/auth.middleware';
import validate from '@/middlewares/validate.middleware';
import { schema } from './question.validate';
class QuestionController extends CrudController implements Controller {
  public path = '/kahoots/:kahootId/questions';
  model = QuestionModel;
  private kahoot = KahootModel;
  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, requireAuth, validate(schema), this.create);
    this.router.put(
      `${this.path}/:id`,
      requireAuth,
      validate(schema),
      this.update
    );
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
  };
  create = async (req: express.Request, res: express.Response) => {
    try {
      const { kahootId } = req.params;
      const data = new this.model(req.body);
      data.save();
      await this.kahoot
        .findOneAndUpdate(
          { _id: kahootId },
          { $push: { questions: data._id } },
          { new: true }
        )
        .populate('questions')
        .lean();
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
