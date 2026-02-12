import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  //References to the User who wrote the comment.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //References the Video being commented on.
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  //User collection every time we just want to display a list of comments.
  username: { type: String, required: true },
  //Actual content of the comment.
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);