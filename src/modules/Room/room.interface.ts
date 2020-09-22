type Status = 'Pending' | 'Playing' | 'Finish';

interface Room {
  kahoot: string;
  pin: number;
  players: Object[];
  status: Status;
}
interface Player {
  username: number;
  points: number;
  questions: Object[];
  answers: Object[];
}
export { Room, Player };
