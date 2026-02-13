import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  //State for displaying UI error messages.
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  //Updates the correct property inside the formData object.
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    //Prevents the default browser page refresh on form submit.
    e.preventDefault();
    setError(""); //Clears previous errors.
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration Successful! Please Login.");
      navigate("/login"); //Redirects to login after register.
    } catch (err) {
      //Displays relevant error messages on UI.
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {/* Error Display */}
        {error && <div style={{color: 'red', marginBottom: '10px', fontSize: '14px'}}>{error}</div>}
        
        {/* Registration Form */}
        <form onSubmit={handleRegister} className="auth-form">
          <input 
            name="username" 
            placeholder="Username" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="email" 
            type="email"
            placeholder="Email" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <button type="submit" className="auth-btn">Register</button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: '#065fd4', fontWeight: 'bold', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;