import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faBolt,
  faClapperboard, 
  faClockRotateLeft, 
  faList, 
  faClock, 
  faThumbsUp 
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  //Sidebar content.
  const mainItems = [
    { name: "Home", icon: faHouse, path: "/" },
    { name: "Shorts", icon: faBolt, path: null }, 
    { name: "Subscriptions", icon: faClapperboard, path: null },
  ];

  const secondaryItems = [
    { name: "History", icon: faClockRotateLeft },
    { name: "Playlists", icon: faList },
    { name: "Watch later", icon: faClock },
    { name: "Liked videos", icon: faThumbsUp }
  ];

  //If the sidebar is closed, don't render anything in the DOM at all.
  if (!isOpen) return null;

  return (
    <div className="sidebar">
      {/* Main Section */}
      <div className="sidebar-section">
        {mainItems.map((item) => (
          <div 
            key={item.name} 
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => item.path && navigate(item.path)}
          >
            <div className="sidebar-icon-container">
               <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="sidebar-divider"></div>

      {/* Secondary Section */}
      <div className="sidebar-section">
        <div className="sidebar-title">You &gt;</div>
        {secondaryItems.map((item) => (
          <div key={item.name} className="sidebar-item">
             <div className="sidebar-icon-container">
               <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;