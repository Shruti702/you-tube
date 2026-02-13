import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//Helper Functions
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
// ------------------------

const Channel = () => {
  //Stores the channel object.
  const [channel, setChannel] = useState(null);
  //Stores the list of videos uploaded by the user.
  const [videos, setVideos] = useState([]);
  //Manages the loading screen while fetching data.
  const [loading, setLoading] = useState(true);
  
  //This object controls a reusable popup window for Success/Error/Confirmation messages.
  const [modal, setModal] = useState({ 
      isOpen: false, 
      title: "", 
      message: "", 
      type: "", 
      onConfirm: null 
  });

  //Tracks if we are currently editing an existing video or uploading a new one.
  const [editingVideoId, setEditingVideoId] = useState(null);
  
  //States for Channel Creation form.
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [desc, setDesc] = useState("");
  //State for Video Upload/Edit form.
  const [formData, setFormData] = useState({ title: "", description: "", videoUrl: "", thumbnailUrl: "", category: [] });
  
  //Retrieves authentication details.
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setName(user.username);
    setHandle(`@${user.username.toLowerCase().replace(/\s/g, '')}`);

    const fetchChannel = async () => {
      try {
        //Attempts to fetch the channel associated with this user ID.
        const res = await axios.get(`http://localhost:5000/api/channels/${user._id}`);
        setChannel(res.data.channel);
        setVideos(res.data.videos);
      } catch (err) {
        setChannel(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, []);

  const closeModal = () => {
    setModal({ ...modal, isOpen: false, onConfirm: null });
  };

  //Channel Creation.
  const handleCreateChannel = async () => {
      try {
          const res = await axios.post("http://localhost:5000/api/channels", 
            { channelName: name, description: desc || "Welcome to my channel!" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setChannel(res.data);
          setModal({ isOpen: true, title: "Success!", message: "Your channel has been created.", type: "success" });
      } catch(err) {
          setModal({ isOpen: true, title: "Error", message: "Failed to create channel.", type: "error" });
      }
  };

  //Handles video ctaegory.
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const { category } = formData;

    if (checked) {
        setFormData({ ...formData, category: [...category, value] });
    } else {
        setFormData({ ...formData, category: category.filter((c) => c !== value) });
    }
  };

  //Handles video uploads and edits.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channel || !channel._id) {
        setModal({ isOpen: true, title: "Error", message: "Channel data missing. Please refresh.", type: "error" });
        return;
    }

    try {
        if (editingVideoId) {
            //Makes a PUT request to update the specific video.
            const res = await axios.put(`http://localhost:5000/api/videos/${editingVideoId}`, 
                formData, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            //Updates the local state array with the newly edited video object.
            setVideos(videos.map(v => v._id === editingVideoId ? res.data : v));
            setModal({ isOpen: true, title: "Success", message: "Video updated successfully!", type: "success" });
            setEditingVideoId(null);
        } else {
            const payload = { ...formData, channelId: channel._id, uploader: user.username };
            const res = await axios.post("http://localhost:5000/api/videos", 
                payload, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            //Appends new video to the existing list.
            setVideos([...videos, res.data]);
            setModal({ isOpen: true, title: "Success", message: "Video uploaded successfully!", type: "success" });
        }
        setFormData({ title: "", description: "", videoUrl: "", thumbnailUrl: "", category: [] });
    } catch (err) {
        const msg = err.response?.data?.message || "Operation failed.";
        setModal({ isOpen: true, title: "Error", message: msg, type: "error" });
    }
  };

  //Pre-fills the upload form with the selected video's data.
  const handleEditClick = (video) => {
      setEditingVideoId(video._id);
      setFormData({
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          videoUrl: video.videoUrl,
          description: video.description,
          category: video.category || []
      });
      //Scrolls to the top of the page so the user sees the form.
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
      setEditingVideoId(null);
      setFormData({ title: "", description: "", videoUrl: "", thumbnailUrl: "", category: [] });
  };

  //Triggers the Confirmation Modal before actual deletion.
  const confirmDelete = (videoId) => {
      setModal({
          isOpen: true,
          title: "Are you sure?",
          message: "Do you really want to delete this video? This action cannot be undone.",
          type: "confirm", 
          onConfirm: () => executeDelete(videoId)
      });
  };

  //The actual API call to delete the video.
  const executeDelete = async (videoId) => {
      try {
          await axios.delete(`http://localhost:5000/api/videos/${videoId}`, { headers: { Authorization: `Bearer ${token}` } });
          //Remove from local state.
          setVideos(videos.filter(v => v._id !== videoId));
          setModal({ isOpen: true, title: "Deleted", message: "The video has been removed.", type: "success" });
      } catch(err) { 
          setModal({ isOpen: true, title: "Error", message: "Could not delete video.", type: "error" });
      }
  };

  if (!user) return <div style={{padding: '50px', textAlign: 'center'}}>Please <a href="/login">login</a> to view your channel.</div>;
  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;

  return (
    <div className="channel-container">
      {modal.isOpen && (
          <div className="notification-overlay">
              <div className="notification-card">
                  <button className="close-icon-btn" onClick={closeModal}>×</button>
                  <h2 className="notification-title" style={{color: modal.type === 'error' ? '#cc0000' : '#1e3a8a'}}>
                      {modal.title}
                  </h2>
                  <p className="notification-message">{modal.message}</p>
                  {modal.type === 'confirm' ? (
                      <div className="modal-btn-row">
                          <button className="notification-btn secondary" onClick={closeModal}>Cancel</button>
                          <button className="notification-btn danger" onClick={modal.onConfirm}>Yes, Delete</button>
                      </div>
                  ) : (
                      <button className="notification-btn" onClick={closeModal}>
                          {modal.type === 'error' ? 'Try Again' : 'Continue'}
                      </button>
                  )}
              </div>
          </div>
      )}

      {!channel ? (
        <div className="modal-overlay">
            <div className="create-channel-modal">
                <h2 className="modal-title">How you'll appear</h2>
                <div className="avatar-section">
                    <img src={`https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=128&bold=true`} alt="Profile" className="modal-avatar" />
                    <button className="select-pic-link">Select picture</button>
                </div>
                <div className="modal-form">
                    <input type="text" className="modal-input-group" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
                    <input type="text" className="modal-input-group" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="Handle"/>
                </div>
                <div className="modal-actions">
                    <button className="btn-create" onClick={handleCreateChannel}>Create channel</button>
                </div>
            </div>
        </div>
      ) : (
        <>
          <div className="dashboard-header">
            <div>
                <h1>{channel.channelName}</h1>
                <p style={{color: 'gray'}}>{channel.description}</p>
                <p style={{fontSize: '14px', color: '#606060'}}>{handle}</p>
            </div>
            <p>{channel.subscribers} Subscribers</p>
          </div>

          <div className="dashboard-content">
            <div className="upload-section">
                <h3>{editingVideoId ? "Edit Video" : "Upload New Video"}</h3>
                <form className="upload-form" onSubmit={handleSubmit}>
                    <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <input placeholder="Thumbnail URL" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} required />
                    <input placeholder="Video URL (mp4 link)" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} required />
                    <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <select 
                        value={formData.category[0] || ""} 
                        onChange={(e) => setFormData({...formData, category: [e.target.value]})} 
                        required
                        style={{ width: '100%', marginBottom: '12px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        <option value="" disabled>Select a Category</option>
                        <option value="Movies">Movies</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Sports">Sports</option>
                        <option value="Cars">Cars</option>
                        <option value="Technology">Technology</option>
                        <option value="Animation">Animation</option>
                        <option value="Comedy">Comedy</option>
                    </select>
                    <button type="submit" className="upload-btn">
                        {editingVideoId ? "UPDATE VIDEO" : "UPLOAD VIDEO"}
                    </button>
                    {editingVideoId && (
                        <button type="button" className="cancel-edit-btn" onClick={cancelEdit}>Cancel Edit</button>
                    )}
                </form>
            </div>

            <div className="video-list-section">
                <h3>Your Videos ({videos.length})</h3>
                {videos.length === 0 ? (
                    <p style={{color: '#606060', marginTop: '10px'}}>No videos uploaded yet.</p>
                ) : (
                    videos.map(v => (
                        <div key={v._id} className="video-list-item" style={{backgroundColor: editingVideoId === v._id ? '#f0f8ff' : 'white'}}>
                            <div style={{display:'flex', gap:'10px'}}>
                                <img src={v.thumbnailUrl} style={{width:'100px', height:'56px', objectFit:'cover', borderRadius: '4px'}} />
                                <div>
                                    <div style={{fontWeight: '600'}}>{v.title}</div>
                                    {/* Uses formatViews and formatDate */}
                                    <div style={{fontSize:'12px', color: '#606060'}}>
                                        {formatViews(v.views)} views • {formatDate(v.uploadDate)}
                                    </div>
                                </div>
                            </div>
                            <div className="video-item-actions">
                                <button className="edit-btn" onClick={() => handleEditClick(v)}>Edit</button>
                                <button className="delete-btn" onClick={() => confirmDelete(v._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Channel;