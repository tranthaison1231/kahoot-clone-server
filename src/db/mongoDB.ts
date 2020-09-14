import mongoose from "mongoose";
export default class MongoDB {
  static async connect() {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
      console.log(`Fail to connect to mongo ${err}`);
      process.exit();
    }
  }
}
