interface Question {
  content: string;
  image: string;
  timeLimit: number;
  points: number;
  isSingleSelect: boolean;
  answers: Object[];
  correctAnswer: string;
}

export default Question;
