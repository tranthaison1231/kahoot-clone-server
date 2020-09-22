import requireAuth from '@/middlewares/auth.middleware';
import roomModel from './room.model';
import playerModel from './player.model';
import * as express from 'express';
import status from 'http-status';
import { Player } from './room.interface';
import { Response, CrudController, Controller } from '@shyn123/express-rest';

class RoomController extends CrudController implements Controller {
  public path = '/rooms';
  model = roomModel;
  private player = playerModel;
  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, requireAuth, this.post);
    this.router.get(this.path, requireAuth, this.getByPin);
    this.router.patch(`${this.path}/:id/join`, requireAuth, this.join);
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    // this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
    // this.router.get(this.path, requireAuth, this.getAll); // for testing
  };
  private getByPin = async (req: express.Request, res: express.Response) => {
    try {
      const { pin } = req.query;
      const io = req.app.get('io');
      io.emit('a', 'aaaaaa');
      if (!pin)
        return Response(res, { message: `Pin not found` }, status.NOT_FOUND);
      const data = await this.model.findOne({ pin: Number(pin) }).lean();
      if (!data)
        return Response(res, { message: `${pin} not found` }, status.NOT_FOUND);
      return Response(res, { _id: data._id });
    } catch (error) {
      return Response(res, { error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  private join = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { username } = req.body;
      const room = await this.model.findById(id).lean();
      if (!room) {
        return Response(res, { message: `${id} not found` }, status.NOT_FOUND);
      }
      if (room.status !== 'Pending') {
        return Response(
          res,
          { message: `This room is ${room.status}` },
          status.FORBIDDEN
        );
      }
      const newPlayer = new this.player({ username });
      newPlayer.save();
      const data = await this.model
        .findOneAndUpdate(
          { _id: id },
          { $push: { players: newPlayer._id } },
          { new: true }
        )
        .populate('kahoot')
        .populate('players')
        .lean();

      return Response(res, { message: 'Join completed', data });
    } catch (error) {
      return Response(res, { error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  private submit = async (req: express.Request, res: express.Response) => {
    // nhan vao question, submitedAnswer,
    // so sanh question.correctAnswer voi submitedAnswer
    // neu trung thi cong point
    // luu voa db
  };
}
export default RoomController;
