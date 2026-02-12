import express from "express";
import { createChannel, getChannelDetails } from "../controllers/channel.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//For creating a new channel.
router.post("/", verifyToken, createChannel);
//To find the correct channel in the database.
router.get("/:userId", getChannelDetails);

export default router;