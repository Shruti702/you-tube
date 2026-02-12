import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //Basic validation.
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required"});

    //Prevents multiple accounts with the same email.
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Find the user by email.
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    //Creates a token containing the user's ID and Username.
    const token = jwt.sign(
        { id: user._id, username: user.username }, 
        JWT_SECRET, 
        { expiresIn: "1h" }
    );
    
    //Sending back user info for the header UI.
    const { password: _, ...userInfo } = user._doc; 
    res.status(200).json({ token, user: userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
