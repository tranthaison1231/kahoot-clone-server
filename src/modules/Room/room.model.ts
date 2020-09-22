import * as mongoose from 'mongoose';
import { Room } from './room.interface';
import { randomPin } from '@/utils/index';
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
  kahoot: {
    type: Schema.Types.ObjectId,
    ref: 'Kahoot',
    required: true
  },
  pin: {
    type: Number,
    default: randomPin
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Player'
    }
  ],
  status: {
    type: String,
    default: 'Pending'
  }
  // currentQuestion: {
  //   type: Object,
  //   ref: 'Question',
  //   required: true
  // }
});

const roomModel = mongoose.model<Room & mongoose.Document>(
  'Room',
  roomSchema,
  'rooms'
);

export default roomModel;
