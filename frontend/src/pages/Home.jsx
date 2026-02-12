import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

//Helper Functions.
//Formats view counts into readable strings.
const formatViews = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num;
};

//Calculates "Time Ago" (e.g., "2 days ago") from a timestamp.
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");
  
  return "Just now";
};
// ------------------------

const Home = () => {
  const [videos, setVideos] = useState([]); //Stores raw data from API.
  const [filteredVideos, setFilteredVideos] = useState([]); //Stores data currently displayed (after category filter).
  const [selectedCategory, setSelectedCategory] = useState("All"); //Tracks active category button.
  //This hook grabs the search value from the URL bar.
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  //Filter categories.
  const categories = [
    "All", "Movies", "Gaming", "Sports", "Cars", 
    "Technology", "Animation", "Comedy"
  ];

  //Fetched Videos.
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const url = searchQuery 
          ? `http://localhost:5000/api/videos?search=${searchQuery}` 
          : "http://localhost:5000/api/videos";
          
        const res = await axios.get(url);
        //Updates both states initially.
        setVideos(res.data);
        setFilteredVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, [searchQuery]);

  //Runs whenever the user clicks a category button OR the video list updates.
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredVideos(videos);
    } else {
      //Filters the existing 'videos' array based on the category field.
      const filtered = videos.filter(video => {
        if (video.category && Array.isArray(video.category)) {
            return video.category.includes(selectedCategory);
        }
        return false;
      });
      setFilteredVideos(filtered);
    }
  }, [selectedCategory, videos]);

  return (
    <div className="home-container">
        {/* Category Filter Bar */}
      <div className="filter-bar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid Layout */}
      <div className="video-grid">
        {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
            <Link to={`/video/${video._id}`} key={video._id} style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="video-card">
                <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
                <div className="video-info">
                    <img src={`https://ui-avatars.com/api/?name=${video.uploader}`} alt="avatar" className="avatar" />
                    <div className="video-details">
                    <h4>{video.title}</h4>
                    <p>{video.uploader}</p>
                    {/* Displays the view count and upload date. */}
                    <p>{formatViews(video.views)} views • {formatDate(video.uploadDate)}</p>
                    </div>
                </div>
                </div>
            </Link>
            ))
        ) : (
            //Displayed if search/filter results in zero videos.
            <div style={{gridColumn: '1/-1', textAlign: 'center', marginTop: '40px', color: '#606060'}}>
                <p>No videos found for "<b>{selectedCategory}</b>"</p>
                <button 
                    onClick={() => setSelectedCategory("All")}
                    style={{marginTop: '10px', color: '#065fd4', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}
                >
                    Clear Filter
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;