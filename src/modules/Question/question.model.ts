import * as mongoose from 'mongoose';
import Question from './question.interface';

const Schema = mongoose.Schema;

const questionSchema = new mongoose.Schema({
  kahootId: {
    type: Schema.Types.ObjectId,
    get: toObjectId
  },
  content: String,
  image: String,
  timeLimit: Number,
  points: Number,
  isSingleSelect: Boolean,
  answers: {
    type: Object,
    default: { A: null, B: null, C: null, D: null }
  },
  correctAnswer: String
});

function toObjectId(kahootId: string) {
  return mongoose.Types.ObjectId(kahootId);
}

const questionModel = mongoose.model<Question & mongoose.Document>(
  'Question',
  questionSchema,
  'questions'
);

export default questionModel;
