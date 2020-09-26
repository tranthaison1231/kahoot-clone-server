import _ from 'lodash';
import * as mongoose from 'mongoose';

export interface UserTransform {
  _id: string;
  username: string;
}

interface User {
  _id: string;
  username: string;
  password: string;

  transform: () => UserTransform;
}
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.method({
  transform() {
    return _.pick(this, 'username', '_id');
  }
});

const userModel = mongoose.model<User & mongoose.Document>(
  'User',
  userSchema,
  'users'
);
export default userModel;
