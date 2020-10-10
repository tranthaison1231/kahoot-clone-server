import {
  createdException,
  joinRoomException,
  notFoundException,
  roomStatusException,
  serverErrorException,
  changeStatusException
} from '@/utils/exception';
import express from 'express';
import RoomModel from './room.model';
import { Request, Response } from 'express';
import PlayerModel from '@/modules/Player/player.model';
import { Controller, Response as HttpResponse } from '@shyn123/express-rest';

class RoomController implements Controller {
  public path = '/rooms';
  public router = express.Router();

  private model = RoomModel;
  private player = PlayerModel;
  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, this.create);
    this.router.get(this.path, this.getByPin);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.patch(`${this.path}/:id/join`, this.join);
    this.router.patch(`${this.path}/:id/:roomStatus`, this.changeStatus);
  };
  create = async (req: Request, res: Response) => {
    try {
      const data = new this.model(req.body);
      await data.save();
      return createdException(res, data);
    } catch (error) {
      serverErrorException(res, error);
    }
  };
  private getByPin = async (req: Request, res: Response) => {
    try {
      const { pin } = req.query;
      if (!pin) return notFoundException(res, 'Pin');
      const data = await this.model.findOne({ pin: Number(pin) }).lean();
      if (!data) return notFoundException(res, pin.toString());
      return HttpResponse(res, { _id: data._id });
    } catch (error) {
      serverErrorException(res, error);
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
        return notFoundException(res, id);
      }
      if (room.status !== 'PENDING') {
        return roomStatusException(res, room);
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
      return joinRoomException(res, data);
    } catch (error) {
      serverErrorException(res, error);
    }
  };
  private changeStatus = async (req: Request, res: Response) => {
    try {
      const { roomStatus, id } = req.params;
      const io = req.app.get('io');
      if (!['playing', 'finish'].includes(roomStatus)) {
        return notFoundException(res, roomStatus);
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
        return notFoundException(res, id);
      }
      io.in(data.pin).emit(`server-room-${roomStatus}`, data);
      return changeStatusException(res, data, roomStatus);
    } catch (error) {
      serverErrorException(res, error);
    }
  };
  getById = async (req: Request, res: Response) => {
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
        return notFoundException(res, id);
      }
      socket.emit('server-room-getbyid', data);
      return HttpResponse(res, { data });
    } catch (error) {
      serverErrorException(res, error);
    }
  };
}
export default RoomController;
