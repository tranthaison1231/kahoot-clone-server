import mongoose from 'mongoose';
import logger from '@/ultis/logger';

const MongoDB = {
  connect: async () => {
    try {
      
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/kahoot', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      logger({
        type: 'Success',
        message: `MongoDB connected: ${conn.connection.host}`
      });
    } catch (err) {
      logger({
        type: 'Error',
        message: `Fail to connect to mongo ${err}`
      });
      process.exit();
    }
  }
};
export default MongoDB;
