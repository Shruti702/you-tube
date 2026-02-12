import express from "express";
import { getAllVideos, seedVideos, getVideoById, likeVideo, addVideo, deleteVideo, updateVideo, dislikeVideo } from "../controllers/video.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//Fetches all videos.
router.get("/", getAllVideos);
//Fetches specific details for a single video by its ID.
router.get("/find/:id", getVideoById);
//Increments the like count.
router.put("/like/:id", likeVideo);
//Increments the dislike count.
router.put("/dislike/:id", dislikeVideo);
//Uploads a new video.
router.post("/", verifyToken, addVideo); 
//Deletes a video.
router.delete("/:id", verifyToken, deleteVideo);
router.post("/seed", seedVideos); 
//Updates video details.
router.put("/:id", verifyToken, updateVideo);

export default router;