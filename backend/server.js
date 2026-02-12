import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MONGO_URI, PORT } from "./config.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/video.js";
import commentRoutes from "./routes/comment.js";
import channelRoutes from "./routes/channel.js";

const app = express();

app.use(express.json());
app.use(cors());

//Connects to MongoDB using the URI provided in the config.
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//Define the base endpoints for the API.
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/channels", channelRoutes);

//Tells the app to listen on the specified port for incoming connections.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});