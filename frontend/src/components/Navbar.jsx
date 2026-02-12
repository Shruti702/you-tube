import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faVideo, faBell, faUserCircle, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

const Navbar = ({ toggleSidebar }) => {
  //This ensures the user stays logged in even if they refresh the page.
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  //Tracks what the user types into the search bar.
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();

  const handleLogout = () => {
    //Clears credentials from browser storage.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    //Redirects to login page.
    navigate("/login");
  };

  //Search Function
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`); //Navigates with query param.
    } else {
      navigate("/"); //Reset if empty.
    }
  };

  //Handles 'Enter' key press.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav className="navbar">
      {/* Menu Toggle & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="menu-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <Link to="/" className="logo">
          <FontAwesomeIcon icon={faYoutube} className="youtube-icon" />
          <span>YouTube</span>
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="search-bar">
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search" 
              style={{ paddingRight: '40px' }} 
              value={searchTerm}
              //Update state as user types.
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown} 
            />
            <div 
              style={{ position: 'absolute', right: '15px', color: '#666', cursor: 'pointer' }}
              onClick={handleSearch} // Trigger search on click
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
        </div>
        <div style={{ marginLeft: '15px', backgroundColor: '#f2f2f2', padding: '10px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faMicrophone} />
        </div>
      </div>

      {/* User Actions */}
      <div className="menu">
        <FontAwesomeIcon icon={faVideo} className="icon-btn" style={{ fontSize: '20px', cursor: 'pointer' }} />
        <FontAwesomeIcon icon={faBell} className="icon-btn" style={{ fontSize: '20px', cursor: 'pointer' }} />

        {/*Check is user is logged in.*/}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: '#065fd4' }} />
            <span style={{ fontWeight: '500' }}>{user.username}</span>
            <Link to="/channel" style={{ color: '#065fd4', fontSize: '20px', padding: '5px' }} title="My Channel">
                <FontAwesomeIcon icon={faVideo} />
            </Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          // If logged out, it shows sign-in button.
          <Link to="/login" className="sign-in-btn">
              <FontAwesomeIcon icon={faUserCircle} style={{ marginRight: '5px' }} />
              Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;