import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, //No two users can have the same username.
  email: { type: String, required: true, unique: true }, //Ensures email addresses are not duplicated in the database.
  password: { type: String, required: true },
  avatar: { type: String, default: "https://via.placeholder.com/150" }, //Used if no avatar is provided during creation.
  //This is an array of ObjectIds that point to documents in the 'Channel' collection.
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }] 
}, { timestamps: true });

export default mongoose.model("User", userSchema);