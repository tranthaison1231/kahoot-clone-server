import Question from '@/modules/Question/question.interface';

interface Kahoot {
  userId: string;
  title: string;
  questions: Question[];
}

export default Kahoot;
