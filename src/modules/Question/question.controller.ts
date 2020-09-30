import {
  Controller,
  CrudController,
  Response as HttpRespone
} from '@shyn123/express-rest';
import status from 'http-status';
import { Request, Response } from 'express';
import QuestionModel from './question.model';
import { schema } from './question.validate';
import requireAuth from '@/middlewares/auth.middleware';
import KahootModel from '@/modules/Kahoot/kahoot.model';
import validate from '@/middlewares/validate.middleware';

class QuestionController extends CrudController implements Controller {
  public path = '/kahoots/:kahootId/questions';
  model = QuestionModel;
  private kahoot = KahootModel;
  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.get(this.path, requireAuth, this.getAll);
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
  getAll = async (req: Request, res: Response) => {
    try {
      const { kahootId } = req.params;
      const kahoot = await this.kahoot.findById(kahootId);
      if (!kahoot) {
        return HttpRespone(
          res,
          { message: `${kahootId} not found` },
          status.NOT_FOUND
        );
      }
      const data = await this.model.find().lean();
      return HttpRespone(res, { data });
    } catch (error) {
      return HttpRespone(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };

  create = async (req: Request, res: Response) => {
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
      return HttpRespone(
        res,
        { message: 'Create completed', data },
        status.CREATED
      );
    } catch (error) {
      return HttpRespone(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
}
export default QuestionController;
