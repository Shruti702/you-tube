import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelName: { type: String, required: true }, //'required: true' ensures a channel cannot be created without a name.
  //Relationship or Reference Field.
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String },
  subscribers: { type: Number, default: 0 },
  //Automatically manages 'createdAt' and 'updatedAt' fields for every document.
}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);