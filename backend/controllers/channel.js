import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

//For creating a channel.
export const createChannel = async (req, res) => {
  try {
    const newChannel = new Channel({ ...req.body, owner: req.user.id });
    //Saves the channel to the database.
    await newChannel.save();
    //Returns the created channel object.
    res.status(201).json(newChannel);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Gets channel's details.
export const getChannelDetails = async (req, res) => {
  try {
    //Finds the channel associated with a specific User ID.
    const channel = await Channel.findOne({ owner: req.params.userId });
    if(!channel) return res.status(404).json({message: "No channel found"});
    
    //Fetches all videos where channelId matches the channel's _id.
    const videos = await Video.find({ channelId: channel._id.toString() });
    
    res.status(200).json({ channel, videos });
  } catch (err) {
    res.status(500).json(err);
  }
};