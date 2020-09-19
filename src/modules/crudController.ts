import express from 'express';
import status from 'http-status';
import Response from '../helpers/response.helper';

export default abstract class CrudController {
  abstract model: any;
  abstract controllerName: string;
  public router = express.Router();

  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const datas = await this.model.find().lean();
      if (!datas.length) {
        return Response(
          res,
          { message: `${this.controllerName} not found` },
          status.NOT_FOUND
        );
      }
      return Response(res, { [this.controllerName]: datas });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id).lean();
      if (!data) {
        return Response(
          res,
          {
            message: `${this.controllerName} not found`
          },
          status.NOT_FOUND
        );
      }
      return Response(res, { [this.controllerName]: data });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  post = async (req: express.Request, res: express.Response) => {
    try {
      const newData = new this.model(req.body);
      await newData.save();
      return Response(
        res,
        { message: 'Create completed', [this.controllerName]: newData },
        status.CREATED
      );
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  deleteById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findByIdAndDelete(id).lean();
      if (!data) {
        return Response(
          res,
          {
            message: `${this.controllerName} not found`
          },
          status.NOT_FOUND
        );
      }
      return Response(res, {
        message: 'Delete completed',
        [this.controllerName]: data
      });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  update = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const newData = await this.model
        .findOneAndUpdate(
          { _id: id },
          {
            $set: { ...req.body }
          },
          { new: true }
        )
        .lean();
      if (!newData) {
        return Response(
          res,
          { message: `${this.controllerName} not found` },
          status.NOT_FOUND
        );
      }
      return Response(
        res,
        { message: 'Edit completed', [this.controllerName]: newData },
        status.OK
      );
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
}
