import Question from '@/modules/Question/question.interface';
import QuestionController from '../Question/question.controller';

type Status = 'PENDING' | 'PLAYING' | 'FINISH';

interface Room {
  kahoot: string;
  pin: number;
  players: Player[];
  status: Status;
  // currentQuestion: Question;
}
interface Player {
  username: number;
  points: number;
  questions: Question[];
  answers: Object[];
}
export { Room, Player };
