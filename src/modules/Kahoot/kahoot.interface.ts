type Type = "Host" | "Chanllenge";
interface Kahoot {
  userId: string;
  title: string;
  type: Type;
}

export default Kahoot;
