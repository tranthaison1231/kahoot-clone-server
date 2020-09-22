import * as mongoose from 'mongoose';
import { Room } from './room.interface';

const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
  kahoot: {
    type: Schema.Types.ObjectId,
    get: toObjectId,
    ref: 'Kahoot'
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
});

function toObjectId(kahootId: string) {
  return mongoose.Types.ObjectId(kahootId);
}
function randomPin() {
  const min: number = 100000;
  const max: number = 999999;
  return Math.round(Math.random() * (max - min) + min);
  // not unique pin, 2 room can have same pin
}
const roomModel = mongoose.model<Room & mongoose.Document>(
  'Room',
  roomSchema,
  'rooms'
);

export default roomModel;
