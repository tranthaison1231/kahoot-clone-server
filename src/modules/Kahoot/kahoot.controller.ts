import {
  Controller,
  Exceptions,
  CrudController,
  Response as HttpResponse
} from '@shyn123/express-rest';
import { Response } from 'express';
import KahootModel from './kahoot.model';
import validate from '@/middlewares/validate.middleware';
import pagination, {
  RequestWithPagination
} from '@/middlewares/pagination.middleware';
import { createSchema, updateSchema } from './kahoot.validate';
import requireAuth, { RequestWithUser } from '@/middlewares/auth.middleware';
import { DEFAULT_PAGE, PERPAGE } from '@/constant';

class KahootController extends CrudController implements Controller {
  public path = '/kahoots';
  model = KahootModel;

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.post(
      this.path,
      requireAuth,
      validate(createSchema),
      this.create
    );
    this.router.put(
      `${this.path}/:id`,
      requireAuth,
      validate(updateSchema),
      this.update
    );
    this.router.get(this.path, requireAuth, pagination, this.getAll);
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
  };

  getAll = async (req: RequestWithPagination, res: Response) => {
    try {
      const { skip, limit, title } = req.pagination;
      const { _id } = req.user;
      const data = await this.model
        .find({
          userId: _id,
          title: {
            $regex: title,
            $options: 'i'
          }
        })
        .populate('questions')
        .lean()
        .skip(skip)
        .limit(limit);
      return HttpResponse(res, { data });
    } catch (error) {
      return Exceptions.ServerError(res, error);
    }
  };
  getById = async (req: RequestWithUser, res: Response) => {
    try {
      const { _id } = req.user;
      const { id } = req.params;
      const data = await this.model
        .findOne({ _id: id, userId: _id })
        .populate('questions')
        .lean();
      if (!data) {
        return Exceptions.NotFound(res, id);
      }
      return HttpResponse(res, { data });
    } catch (error) {
      return Exceptions.ServerError(res, error);
    }
  };
  create = async (req: RequestWithUser, res: Response) => {
    try {
      const { _id } = req.user;
      const data = new this.model({ ...req.body, userId: _id });
      await data.save();
      return Exceptions.Create(res, data);
    } catch (error) {
      return Exceptions.NotFound(res, error);
    }
  };
  update = async (req: RequestWithUser, res: Response) => {
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
        return Exceptions.NotFound(res, id);
      }
      return Exceptions.Edit(res, data);
    } catch (error) {
      return Exceptions.ServerError(res, error);
    }
  };
}
export default KahootController;
