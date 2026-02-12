import Comment from "../models/Comment.js";

//For adding comments.
export const addComment = async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Finds all comments for a video id.
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

//For deleting comments.
export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("Comment deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

//For editing the comments.
export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json("Comment not found");

    //Checks if the user matches the comment owner.
    if (comment.userId.toString() !== req.user.id) {
        return res.status(403).json("You can only edit your own comments!");
    }
    
    //For updating the comments after editing.
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json(err);
  }
};