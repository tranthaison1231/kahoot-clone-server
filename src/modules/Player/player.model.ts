import mongoose from 'mongoose';
import { Player } from '@/modules/Room/room.interface';

const playerSchema = new mongoose.Schema({
  username: String,
  points: {
    type: Number,
    default: 0
  },
  questions: {
    type: Array,
    default: [],
    ref: 'Question'
  },
  answers: {
    type: Array,
    default: []
  }
});

const playerModel = mongoose.model<Player & mongoose.Document>(
  'Player',
  playerSchema,
  'players'
);

export default playerModel;
