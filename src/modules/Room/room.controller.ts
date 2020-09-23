import express from 'express';
import status from 'http-status';
import roomModel from './room.model';
import { Request, Response } from 'express';
import playerModel from '@/modules/Player/player.model';
import { Controller, Response as HttpResponse } from '@shyn123/express-rest';

class RoomController implements Controller {
  public path = '/rooms';
  public router = express.Router();

  private model = roomModel;
  private player = playerModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, this.post);
    this.router.get(this.path, this.getByPin);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.patch(`${this.path}/:id/join`, this.join);
    this.router.patch(`${this.path}/:id/:roomStatus`, this.changeStatus);
  };
  private post = async (req: Request, res: Response) => {
    try {
      const data = new this.model(req.body);
      await data.save();
      return HttpResponse(
        res,
        { message: 'Create completed', data },
        status.CREATED
      );
    } catch (error) {
      return HttpResponse(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  private getByPin = async (req: Request, res: Response) => {
    try {
      const { pin } = req.query;
      if (!pin)
        return HttpResponse(
          res,
          { message: `Pin not found` },
          status.NOT_FOUND
        );
      const data = await this.model.findOne({ pin: Number(pin) }).lean();
      if (!data)
        return HttpResponse(
          res,
          { message: `${pin} not found` },
          status.NOT_FOUND
        );
      return HttpResponse(res, { _id: data._id });
    } catch (error) {
      return HttpResponse(res, { error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  private join = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { username } = req.body;
      const socket = req.app.get('socket');
      const io = req.app.get('io');
      const room = await this.model.findById(id).lean();
      if (!room) {
        return HttpResponse(
          res,
          { message: `${id} not found` },
          status.NOT_FOUND
        );
      }
      if (room.status !== 'PENDING') {
        return HttpResponse(
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
        .populate('currentQuestion')
        .lean();

      socket.join(data.pin);
      io.in(data.pin).emit('server-user-join', data);
      return HttpResponse(res, { message: 'Join completed', data });
    } catch (error) {
      return HttpResponse(res, { error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  private changeStatus = async (req: Request, res: Response) => {
    try {
      const { roomStatus, id } = req.params;
      const io = req.app.get('io');
      if (!['playing', 'finish'].includes(roomStatus)) {
        return HttpResponse(
          res,
          { message: `${roomStatus} not found` },
          status.NOT_FOUND
        );
      }
      const data = await this.model
        .findByIdAndUpdate(
          id,
          { $set: { status: roomStatus === 'playing' ? 'PLAYING' : 'FINISH' } },
          { new: true }
        )
        .populate('kahoot')
        .populate('players')
        .populate('currentQuestion')
        .lean();
      if (!data) {
        return HttpResponse(
          res,
          { message: `${id} not found` },
          status.NOT_FOUND
        );
      }
      io.in(data.pin).emit(`server-room-${roomStatus}`, data);
      return HttpResponse(res, { message: `Room is ${roomStatus}`, data });
    } catch (error) {
      return HttpResponse(res, { error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  private getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const socket = req.app.get('socket');
      const data = await this.model
        .findById(id)
        .populate('kahoot')
        .populate('players')
        .populate('currentQuestion')
        .lean();
      if (!data) {
        return HttpResponse(
          res,
          {
            message: `${id} not found`
          },
          status.NOT_FOUND
        );
      }
      socket.emit('server-room-getbyid', data);
      return HttpResponse(res, { data });
    } catch (error) {
      return HttpResponse(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
}
export default RoomController;
