import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  description: { type: String, required: true },
  channelId: { type: String, required: true }, //Linking to a channel string for now.
  uploader: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  videoUrl: { type: String, required: true }, 
  category: { type: [String], default: [] }, //Used in filtering videos by category.
});

export default mongoose.model("Video", videoSchema);