import {
  Controller,
  CrudController,
  Response as HttpResponse
} from '@shyn123/express-rest';
import status from 'http-status';
import { Request, Response } from 'express';
import QuestionModel from './question.model';
import { schema } from './question.validate';
import requireAuth from '@/middlewares/auth.middleware';
import KahootModel from '@/modules/Kahoot/kahoot.model';
import validate from '@/middlewares/validate.middleware';
import { isImage } from '@/utils';
import { multerUploads, dataUri } from '@/middlewares/upload.middleware';
import { upload } from '@/utils/uploadImage';
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
    this.router.post('/image', requireAuth, multerUploads, this.upload);
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
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
      return HttpResponse(
        res,
        { message: 'Create completed', data },
        status.CREATED
      );
    } catch (error) {
      return HttpResponse(
        res,
        { error: error.message },
        status.INTERNAL_SERVER_ERROR
      );
    }
  };
  upload = async (req: Request, res: Response) => {
    try {
      if (!req.file || !isImage(req.file)) {
        return HttpResponse(
          res,
          { message: 'Image not found' },
          status.NOT_FOUND
        );
      }
      const file = dataUri(req).content;
      const image = await upload(file);
      return HttpResponse(
        res,
        { message: 'Upload completed', url: image.url },
        status.OK
      );
    } catch (error) {
      return HttpResponse(
        res,
        { error: error.message },
        status.INTERNAL_SERVER_ERROR
      );
    }
  };
}
export default QuestionController;
