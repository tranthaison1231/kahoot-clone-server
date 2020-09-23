import Question from '@/modules/Question/question.interface';
import Kahoot from '@/modules/Kahoot/kahoot.interface';

type Status = 'PENDING' | 'PLAYING' | 'FINISH';

export interface Room {
  kahoot: Kahoot;
  pin: number;
  players: Player[];
  status: Status;
  currentQuestion: Question;
}
export interface Player {
  username: number;
  points: number;
  questions: Question[];
  answers: Object[];
}
