import {
  createdException,
  notFoundException,
  uploadImageException,
  serverErrorException
} from '@/utils/exception';
import { isImage } from '@/utils';
import { Request, Response } from 'express';
import QuestionModel from './question.model';
import { schema } from './question.validate';
import { uploadImage } from '@/utils/uploadImage';
import requireAuth from '@/middlewares/auth.middleware';
import KahootModel from '@/modules/Kahoot/kahoot.model';
import validate from '@/middlewares/validate.middleware';
import { Controller, CrudController } from '@shyn123/express-rest';
import { multerUploads, dataUri } from '@/middlewares/upload.middleware';

class QuestionController extends CrudController implements Controller {
  public path = '/kahoots/:kahootId/questions';
  model = QuestionModel;
  private kahoot = KahootModel;
  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.put(
      `${this.path}/:id`,
      requireAuth,
      validate(schema),
      this.update
    );
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    this.router.post('/image', requireAuth, multerUploads, this.upload);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
    this.router.post(this.path, requireAuth, validate(schema), this.create);
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
      return createdException(res, data);
    } catch (error) {
      return serverErrorException(res, error);
    }
  };
  upload = async (req: Request, res: Response) => {
    try {
      if (!req.file || !isImage(req.file)) {
        return notFoundException(res, 'Image');
      }
      const file = dataUri(req).content;
      const image = await uploadImage(file);
      return uploadImageException(res, image);
    } catch (error) {
      return serverErrorException(res, error);
    }
  };
}
export default QuestionController;
