import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Kahoot from './kahoot.interface';

const kahootSchema = new mongoose.Schema({
  userId: Schema.Types.ObjectId,
  title: String
});

const kahootModel = mongoose.model<Kahoot & mongoose.Document>(
  'Kahoot',
  kahootSchema,
  'kahoots'
);

export default kahootModel;
