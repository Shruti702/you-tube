import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  //Stores user inputs for email and password.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //Stores error messages to display to the user if login fails.
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    //Clears any previous errors before attempting a new login.
    setError(""); 
    try {
      //Sends the user's credentials to the backend via POST request.
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      
      // Requirement: Use JWT for authentication 
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      navigate("/");
      // Reload to update Navbar with the user's name 
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      //Safely checks if the backend sent a specific error message.
      setError(err.response?.data?.message || "Login failed! Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In</h2>
        {/* Error Message Display on UI. */}
        {error && <div style={{color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px', fontSize: '14px'}}>{error}</div>}
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className="auth-form">
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="auth-btn">Login</button>
        </form>

        {/* Navigation to Registration */}
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: '#065fd4', fontWeight: 'bold', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;