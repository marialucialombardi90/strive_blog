import express from "express";
import passport from "passport";
import {
  register,
  login,
  googleCallback,
  me,
} from "../controllers/auth.controller.js";
import authorization from "../middleware/authorization.js";
import uploadCloudinary from "../middleware/cloudinaryConfigMulter.js";

const authRoutes = express.Router();

authRoutes.post("/register", uploadCloudinary.single("avatar"), register);

authRoutes.post("/login", login);

authRoutes.get("/me", authorization, me);

authRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoutes.get(
  "/google-callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default authRoutes;
