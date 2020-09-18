import * as express from 'express';
import Controller from '@/interfaces/controller.interface';
import Question from './question.interface';
import QuestionModel from './question.model';
import Response from '@/helpers/response.helper';
import mongoose from 'mongoose';
import status from 'http-status';
import requireAuth from '@/middlewares/auth.middleware';

class QuestionController implements Controller {
  public path = '/kahoots/:kahootId/questions';
  public router = express.Router();
  private question = QuestionModel;

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
    const question: Question = req.body;
    const newQuestion = new this.question({
      ...question,
      kahootId: mongoose.Types.ObjectId(question.kahootId)
    });
    await newQuestion.save();
    return Response(
      res,
      { message: 'Create completed', question: newQuestion },
      status.CREATED
    );
  };
  private getAll = async (req: express.Request, res: express.Response) => {
    const questions = await this.question.find();
    if (!questions.length) {
      return Response(
        res,
        { message: 'Questions not found' },
        status.NOT_FOUND
      );
    }
    Response(res, { questions });
  };
  private getById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const question = await this.question.findById(id);
    if (!question) {
      return Response(res, { message: 'Question not found' }, status.NOT_FOUND);
    }
    Response(res, { question });
  };
  private deleteById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const question = await this.question.findByIdAndDelete(id);
    if (!question) {
      return Response(res, { message: 'Question not found' }, status.NOT_FOUND);
    }
    Response(res, { message: 'Delete completed', question }, status.CREATED);
  };
  private update = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const question: Question = req.body;
    const newQuestion = await this.question.findOneAndUpdate(
      { _id: id },
      {
        $set: { ...question }
      },
      { new: true }
    );
    if (!newQuestion) {
      return Response(res, { message: 'Question not found' }, status.NOT_FOUND);
    }
    return Response(
      res,
      { message: 'Edit completed', question: newQuestion },
      status.CREATED
    );
  };
}
export default QuestionController;
