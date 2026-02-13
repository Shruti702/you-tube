import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faShare, faDownload, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

//Helper Functions.
const formatViews = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num;
};

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
  
  return "Just now";
};

const VideoPlayer = () => {
  //Extracts the video 'id' from the URL.
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  
  //Tracks which comment is currently being edited.
  const [editingCommentId, setEditingCommentId] = useState(null);
  //Stores the temporary text while the user is typing the edit.
  const [editText, setEditText] = useState("");
  
  //Retrieves user auth info.
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Fetches current video details.
        const videoRes = await axios.get(`http://localhost:5000/api/videos/find/${id}`);
        setVideo(videoRes.data);

        //Fetches comments for this specific video.
        const commentRes = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(commentRes.data);

        //Fetches all videos and filters out the current one to create the sidebar list.
        const allVideosRes = await axios.get("http://localhost:5000/api/videos");
        setSuggestedVideos(allVideosRes.data.filter(v => v._id !== id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.put(`http://localhost:5000/api/videos/like/${id}`);
      //Update UI without waiting for another GET request.
      setVideo((prev) => ({ ...prev, likes: prev.likes + 1 }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(`http://localhost:5000/api/videos/dislike/${id}`);
      setVideo((prev) => ({ ...prev, dislikes: prev.dislikes + 1 }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/comments",
        { videoId: id, text: newComment, username: user.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //Appends new comment to the existing array and clear the input box.
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
      try {
          await axios.delete(`http://localhost:5000/api/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
          //Removes the deleted comment from the state array.
          setComments(comments.filter(c => c._id !== commentId));
      } catch (err) {
          console.error(err);
      }
  };

  
  const handleEditClick = (comment) => {
      setEditingCommentId(comment._id);
      setEditText(comment.text);
  };

  //Closes the edit box without saving.
  const handleEditCancel = () => {
      setEditingCommentId(null);
      setEditText(""); 
  };

  //Submits the edited text to the backend.
  const handleEditSave = async (commentId) => {
      try {
          const res = await axios.put(
              `http://localhost:5000/api/comments/${commentId}`,
              { text: editText },
              { headers: { Authorization: `Bearer ${token}` } }
          );
          //Updates the specific comment in the list.
          setComments(comments.map(c => c._id === commentId ? res.data : c));
          setEditingCommentId(null);
          setEditText("");
      } catch (err) {
          console.error(err);
          alert("Failed to update comment");
      }
  };

  //Prevents rendering if data hasn't loaded yet.
  if (!video) return <div style={{padding: '20px'}}>Loading...</div>;

  return (
    <div className="video-page-layout">
        {/* Main Video and Details */}
      <div className="video-primary-column">
        <div className="video-wrapper">
            <video 
                className="video-frame" 
                controls 
                autoPlay 
                src={video.videoUrl} 
                poster={video.thumbnailUrl} 
            />
        </div>

        <h1 className="video-title-main">{video.title}</h1>

        {/* Channel Info */}
        <div className="video-header-row">
            <div className="channel-info">
                <img src={`https://ui-avatars.com/api/?name=${video.uploader}&background=random`} alt="channel" className="channel-avatar-lg" />
                <div className="channel-text">
                    <h3 className="channel-name">{video.uploader}</h3>
                    <span className="sub-count">1.2M subscribers</span>
                </div>
                <button className="subscribe-btn">Subscribe</button>
            </div>

            {/* Interaction Buttons (Like, Dislike) */}
            <div className="video-actions-pills">
                <div className="action-pill">
                    <button className="pill-btn left" onClick={handleLike}>
                        <FontAwesomeIcon icon={faThumbsUp} /> {video.likes}
                    </button>
                    <div className="pill-divider"></div>
                    <button className="pill-btn right" onClick={handleDislike}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                        {video.dislikes > 0 && <span style={{marginLeft: '6px'}}>{video.dislikes}</span>}
                    </button>
                </div>

                <button className="action-pill-btn">
                    <FontAwesomeIcon icon={faShare} /> Share
                </button>
                <button className="action-pill-btn">
                    <FontAwesomeIcon icon={faDownload} /> Download
                </button>
                <button className="action-pill-circle">
                    <FontAwesomeIcon icon={faEllipsisH} />
                </button>
            </div>
        </div>

        {/* Video Description */}
        <div className="description-box">
            <p className="views-date">{formatViews(video.views)} views • {formatDate(video.uploadDate)}</p>
            <p className="desc-text">{video.description}</p>
        </div>

        {/* --- Comment Section --- */}
        <div className="comments-container">
            <h3>{comments.length} Comments</h3>
            {/* New Comment Input */}
            <form onSubmit={handleComment} className="comment-form">
                <img src={user ? `https://ui-avatars.com/api/?name=${user.username}` : "https://via.placeholder.com/40"} className="user-avatar-sm" />
                <input 
                    className="comment-input-line" 
                    placeholder="Add a comment..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="comment-submit-btn">Comment</button>
            </form>

            {/* Renders List of Comments. */}
            <div className="comment-list">
                {comments.map((c) => (
                    <div key={c._id} className="comment-thread">
                        <img src={`https://ui-avatars.com/api/?name=${c.username}`} className="user-avatar-sm" />
                        <div className="comment-body" style={{width: '100%'}}>
                            <div className="comment-header">
                                <span className="comment-author">{c.username}</span>
                                <span className="comment-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* --- CONDITIONAL RENDERING FOR EDITING --- */}
                            {editingCommentId === c._id ? (
                                <div className="edit-mode-container">
                                    <input 
                                        type="text" 
                                        className="edit-comment-input"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="edit-actions-row">
                                        <button className="edit-action-btn cancel" onClick={handleEditCancel}>Cancel</button>
                                        <button className="edit-action-btn save" onClick={() => handleEditSave(c._id)}>Save</button>
                                    </div>
                                </div>
                            ) : (
                                <p>{c.text}</p>
                            )}
                            
                            {/* Edit/Delete Action */}
                            {user && user._id === c.userId && !editingCommentId && (
                                <div className="comment-actions-row">
                                    <button className="action-text-btn" onClick={() => handleEditClick(c)}>Edit</button>
                                    <button className="action-text-btn" onClick={() => handleDeleteComment(c._id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

       {/* Suggested Videos Sidebar */}
      <div className="video-secondary-column">
          {suggestedVideos.map((v) => (
             <Link to={`/video/${v._id}`} key={v._id} className="suggested-video-card">
                 <div className="suggested-thumbnail-wrapper">
                    <img src={v.thumbnailUrl} alt={v.title} className="suggested-thumbnail" />
                 </div>
                 <div className="suggested-details">
                     <h4 className="suggested-title">{v.title}</h4>
                     <p className="suggested-channel">{v.uploader}</p>
                     <p className="suggested-meta">{formatViews(v.views)} views • {formatDate(v.uploadDate)}</p>
                 </div>
             </Link>
          ))}
      </div>
    </div>
  );
};

export default VideoPlayer;