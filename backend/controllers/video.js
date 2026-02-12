import Video from "../models/Video.js";

//Gets all videos when searched.
export const getAllVideos = async (req, res) => {
  try {
    const query = req.query.search 
      ? { title: { $regex: req.query.search, $options: "i" } } 
      : {};
    const videos = await Video.find(query);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    //Finds the video using the ID passed in the URL parameters.
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//For liking the videos.
export const likeVideo = async (req, res) => {
  try {
    //Fetches the video document.
    const video = await Video.findById(req.params.id);
    //Updates the likes count of a video.
    video.likes += 1;
    await video.save();
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//For adding the videos.
export const addVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, channelId, uploader, category } = req.body;
    const newVideo = new Video({ title, description, videoUrl, thumbnailUrl, channelId, uploader, category });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//For deleting the videos.
export const deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json("Video has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const seedVideos = async (req, res) => {
    try {
        const sampleVideos = [
            {
                title: "Learn React in 30 Minutes",
                thumbnailUrl: "https://via.placeholder.com/320x180.png?text=React+Tutorial",
                description: "A quick tutorial to get started with React.",
                channelId: "channel01",
                uploader: "CodeMaster",
                views: 15200,
                likes: 1023,
                videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            },
            {
                title: "MERN Stack Crash Course",
                thumbnailUrl: "https://via.placeholder.com/320x180.png?text=MERN+Stack",
                description: "Full stack development guide.",
                channelId: "channel02",
                uploader: "DevGuru",
                views: 20500,
                likes: 500,
                videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            }
        ];
        //Inserts multiple documents at once.
        await Video.insertMany(sampleVideos);
        res.status(201).json({ message: "Sample videos added" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

 //For updating videos.
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    
    //Ensures only the user who uploaded the video can edit it.
    if (req.user.username !== video.uploader) {
        return res.status(403).json({ message: "You can only update your own videos!" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedVideo);
  } catch (err) {
    res.status(500).json(err);
  }
};

//For disliking the videos.
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    //Updates the count of dislikes in the videos.
    video.dislikes += 1;
    await video.save();
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};