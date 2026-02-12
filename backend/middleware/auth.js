import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

//Checks if the requester has a valid token before allowing access.
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  //Returns 401 (Unauthorized) because they aren't logged in.
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const tokenString = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
    //Checks if the token is valid.
    const verified = jwt.verify(tokenString, JWT_SECRET);
    //Attaches user data.
    req.user = verified;
    //Moves on to the next middleware or the actual route controller.
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};