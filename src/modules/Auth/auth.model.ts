import * as mongoose from "mongoose";
import { User } from "./auth.interface";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.methods.correctPassword = async function(candidatePassword:string , userPassword:string ) {
  return await bcrypt.compare( candidatePassword, userPassword);
}
userSchema.pre('save', async function(next) {
  // ONLY run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // HASH the password with cost of 
  this.password = await bcrypt.hash(this.password, 10);

  next();
});
const userModel = mongoose.model<User & mongoose.Document>(
  "User",
  userSchema,
  "users"
);

export default userModel;
