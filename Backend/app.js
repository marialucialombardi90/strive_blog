import "dotenv/config";
import passport from "passport";
import googleAuth from "./config/passport.google.config.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import authorization from "./middleware/authorization.js";

// Registers the Google OAuth strategy with Passport.js for user authentication.
// The "google" strategy name is used for identifying this particular strategy.
// 'googleAuth' defines the specific configuration and logic for authenticating users via Google.
passport.use("google", googleAuth);

// making server with express
const server = express();

// making a connection to the db
await mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("db connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });

// Middleware to parse incoming JSON requests into JavaScript objects
server.use(express.json());

// Middleware to enable Cross-Origin Resource Sharing (CORS) to allow requests from other domains
server.use(cors());

// Middleware to log HTTP requests in the "dev" format (concise output for development use)
server.use(morgan("dev"));

// Middleware to secure HTTP headers and enhance security (Helmet helps protect against common vulnerabilities)
server.use(helmet());

// Basic health check endpoint that responds with a JSON object indicating the server is running
server.get("/", (req, res) => {
  return res.json({
    health: "ok",
  });
});

server.use("/auth", authRoutes);

server.use("/authors", authorization, authorRoutes);

server.use("/blogPosts", authorization, postRoutes);

const port = process.env.PORT || 5500;

// make the server listen to given port
server.listen(port, () => {
  console.log("The server is running at ", `http://localhost:${port}`);
});
