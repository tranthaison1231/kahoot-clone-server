import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Question from './question.interface';

const questionSchema = new mongoose.Schema({
  kahootId: Schema.Types.ObjectId,
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

const questionModel = mongoose.model<Question & mongoose.Document>(
  'Question',
  questionSchema,
  'questions'
);

export default questionModel;
