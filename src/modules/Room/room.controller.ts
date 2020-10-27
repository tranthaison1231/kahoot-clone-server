import {
  JoinRoomException,
  RoomStatusException,
  ChangeStatusException
} from '@/utils/exception';
import express from 'express';
import RoomModel from './room.model';
import { randomPin } from '@/utils/index';
import { Request, Response } from 'express';
import PlayerModel from '@/modules/Player/player.model';
import {
  Controller,
  Response as HttpResponse,
  Exception
} from '@shyn123/express-rest';

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
    this.router.get(this.path, this.submitAnswer);
    this.router.patch(`${this.path}/out`, this.out);
    this.router.patch(`${this.path}/join`, this.join);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.get(`${this.path}/:id/next`, this.nextQuestion);
    this.router.patch(`${this.path}/:id/:roomStatus`, this.changeStatus);
  };
  create = async (req: Request, res: Response) => {
    try {
      const data = new this.model(req.body);
      await data.save();
      return Exception.Create(res, data);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
  private getByPin = async (req: Request, res: Response) => {
    try {
      const { pin } = req.query;
      if (!pin) return Exception.NotFound(res, 'Pin');
      const data = await this.model
        .findOne(
          { pin: Number(pin) },
          { _id: 0, pin: 1, players: 1, status: 1 }
        )
        .lean();
      if (!data) return Exception.NotFound(res, pin.toString());
      return HttpResponse(res, data);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
  private join = async (req: Request, res: Response) => {
    try {
      const { pin, username } = req.body;
      const socket = req.app.get('socket');
      const io = req.app.get('io');
      const room = await this.model.findOne({ pin }).lean();
      if (!room) {
        return Exception.NotFound(res, pin);
      }
      if (room.status !== 'PENDING') {
        return RoomStatusException(res, room);
      }
      const newPlayer = new this.player({ username });
      newPlayer.save();
      const data = await this.model
        .findOneAndUpdate(
          { pin },
          { $push: { players: newPlayer._id } },
          {
            fields: { _id: 0, pin: 1, players: 1, status: 1 },
            new: true
          }
        )
        .populate('players')
        .lean();
      socket.join(data.pin);
      io.in(data.pin).emit('server-user-join', data);
      return JoinRoomException(res, data);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
  private changeStatus = async (req: Request, res: Response) => {
    try {
      const { roomStatus, id } = req.params;
      const io = req.app.get('io');
      if (!['playing', 'finish'].includes(roomStatus)) {
        return Exception.NotFound(res, roomStatus);
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
        return Exception.NotFound(res, id);
      }
      io.in(data.pin).emit(`server-room-${roomStatus}`, data);
      return ChangeStatusException(res, data, roomStatus);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const socket = req.app.get('socket');
      const io = req.app.get('io');
      const data = await this.model
        .findByIdAndUpdate(id, {
          $set: { pin: randomPin() }
        })
        .populate('kahoot')
        .populate('players')
        .populate('currentQuestion')
        .lean();
      if (!data) {
        return Exception.NotFound(res, id);
      }
      io.to(socket.id).emit('server-room-getbyid', data);
      return HttpResponse(res, { data });
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
  private out = async (req: Request, res: Response) => {
    try {
      const { pin, username } = req.body;
      const socket = req.app.get('socket');
      const io = req.app.get('io');
      const room = await this.model.findOne({ pin }).lean();
      if (!room) {
        return Exception.NotFound(res, pin);
      }
      const player = await this.player.findOneAndDelete({ username });
      const data = await this.model
        .findOneAndUpdate(
          { pin },
          { $pull: { players: player._id } },
          {
            fields: { _id: 0, pin: 1, players: 1, status: 1 },
            new: true
          }
        )
        .populate('players')
        .lean();
      socket.leave(data.pin);
      io.in(data.pin).emit('server-user-out', data);
      return JoinRoomException(res, data);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
  private nextQuestion = async (req: Request, res: Response) => {
    // danh cho host
    try {
      const { id } = req.params;
      const socket = req.app.get('socket');
      const io = req.app.get('io');
      const room = await this.model.findById(id).lean();
      if (!room) {
        return Exception.NotFound(res, id);
      }
      if (room.status !== 'PLAYING') {
        return RoomStatusException(res, room);
      }
      const data = await this.model.findById(id).populate('kahoot');
      const curQuestion = data.currentQuestion;
      const questions = data.kahoot.questions;
      const curQuestionIndex = questions.findIndex((question) => {
        return question.toString() === curQuestion.toString();
      });
      const nextQuestion = questions[curQuestionIndex + 1];
      data.currentQuestion = nextQuestion;
      await data.save();
      await data.populate('currentQuestion').execPopulate();
      io.to(socket.id).emit('server-next-question', data);
      return JoinRoomException(res, data);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
  private submitAnswer = async (req: Request, res: Response) => {
    try {
      const { pin, username, question, answer, time } = req.body;
      const room = await this.model.findOne({ pin }).lean();
      if (!room) {
        return Exception.NotFound(res, pin);
      }
      if (room.status !== 'PLAYING') {
        return RoomStatusException(res, room);
      }
      const player = await this.player
        .findOneAndUpdate(
          { username },
          { $push: { questions: question, answers: answer } },
          { new: true }
        )
        .populate('questions');
      player.questions.forEach((question, index) => {
        if (question.correctAnswer === answer[index])
          player.points +=
            question.points * Math.round(time / question.timeLimit);
      });
      await player.save();
      return HttpResponse(res, { message: 'Submit completed' });
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
}
export default RoomController;
