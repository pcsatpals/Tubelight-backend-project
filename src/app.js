import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { specs, swaggerUi } from "./swagger.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//to describe that we are going to accept only JSON data for now
app.use(express.json({ limit: "16kb" }));

// To accept the encoded URL also for example Google convert spaces to "20%"
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// To store media or static files into public folder
app.use(express.static("public"));
// To perform CRUD operations on cookies
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);

// To throw error in a json format
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // fallback for other errors
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export { app };
