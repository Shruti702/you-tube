import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const categories = [
    "All", "Movies", "Gaming", "Sports", "Cars", 
    "Technology", "Animation", "Comedy"
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const url = searchQuery 
          ? `http://localhost:5000/api/videos?search=${searchQuery}` 
          : "http://localhost:5000/api/videos";
          
        const res = await axios.get(url);
        setVideos(res.data);
        setFilteredVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredVideos(videos);
    } else {
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
                    </div>
                </div>
                </div>
            </Link>
            ))
        ) : (
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