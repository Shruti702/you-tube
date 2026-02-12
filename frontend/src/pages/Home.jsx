import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

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

  return (
    <div className="home-container">

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
                <p></p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;