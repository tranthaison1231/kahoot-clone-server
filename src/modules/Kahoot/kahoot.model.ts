import * as mongoose from 'mongoose';
import Kahoot from './kahoot.interface';

const Schema = mongoose.Schema;

const kahootSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    get: toObjectId
  },
  title: String
});

function toObjectId(userId: string) {
  return mongoose.Types.ObjectId(userId);
}

const kahootModel = mongoose.model<Kahoot & mongoose.Document>(
  'Kahoot',
  kahootSchema,
  'kahoots'
);

export default kahootModel;
