import * as mongoose from "mongoose";
import Auth from "./auth.interface";

const authSchema = new mongoose.Schema({
  username: String,
  password: String
});

const authModel = mongoose.model<Auth & mongoose.Document>("Auth", authSchema);

export default authModel;