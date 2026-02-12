import express from "express";
import { register, login } from "../controllers/auth.js";

// Create a new router instance to handle specific routes.
const router = express.Router();
//Calls the register function from the controller for new account registration.
router.post("/register", register);
//Calls the login function from the controller for loggin into the existing account.
router.post("/login", login);

export default router;