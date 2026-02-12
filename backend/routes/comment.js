import express from "express";
import { addComment, getComments, deleteComment, editComment } from "../controllers/comment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
//Allows an authenticated user to post a comment.
router.post("/", verifyToken, addComment);
//Fetches all comments associated with a specific video ID.
router.get("/:videoId", getComments);
//Deletes a specific comment by its unique ID.
router.delete("/:id", verifyToken, deleteComment);
//Updates the text of an existing comment.
router.put("/:id", verifyToken, editComment);

export default router;