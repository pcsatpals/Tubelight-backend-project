import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandlers.js";

const createPlayList = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!(title || description)) {
    throw new ApiError(400, "Title and Descriptions are required");
  }

  console.log(req.user);

  const existingPlaylist = await Playlist.find({
    title,
  }).populate({
    path: "owner",
    match: {
      _id: new mongoose.Types.ObjectId(req.user._id),
    },
  });

  if (existingPlaylist) {
    throw new ApiError(404, "Playlist with the same name is already exists");
  }

  const playlist = await Playlist.create({
    title,
    description,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

export { createPlayList };
