import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { Video } from "../models/video.model.js";

const createPlayList = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!(name || description)) {
    throw new ApiError(400, "name and Descriptions are required");
  }

  const existingPlaylist = await Playlist.findOne({
    name,
    owner: req.user?._id,
  });

  if (existingPlaylist) {
    throw new ApiError(404, "Playlist with the same name is already exists");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const deletePlayList = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const isOwner = playlist.isOwner(req.user._id);

  if (!isOwner) {
    throw new ApiError(404, "Only owner can delete their playlist");
  }

  // Delete all videos in the playlist
  if (playlist.videos.length > 0) {
    try {
      await Video.deleteMany({ _id: { $in: playlist.videos } });
    } catch (error) {
      console.log("Error while deleting videos in playlist", error);
    }
  }

  await playlist.deleteOne();

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist deleted successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }
  const userPlaylists = await Playlist.find({
    owner: userId,
  }).populate({
    path: "videos",
    select: "thumbnail",
  });

  if (!userPlaylists) {
    throw new ApiError(400, "Playlists not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylists, "Playlists fetched Successfully")
    );
});

const getPlaylistByPlaylistID = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id");
  }

  //Get playlist by Id
  //Owner --> Owner will be an object not an array
  // Owner has only id, username, fullname and Avatar
  //Videos
  // Each Video must be owner
  // Views -->  Count

  const playList = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $addFields: {
              views: {
                $cond: {
                  if: { $isArray: "$views" },
                  then: { $size: "$views" },
                  else: { $ifNull: ["$views", 0] },
                },
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        videosCount: {
          $size: "$videos",
        },
      },
    },
  ]);

  if (!playList) {
    throw new ApiError(400, "Playlist's not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Playlist fetched Successfully"));
});

const addVideoInPlayList = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.body;

  // Playlist Owner and video Owners are same to the req.user._id
  if (!isValidObjectId(videoId) || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Video Id or PlaylistId");
  }

  const video = await Video.findById(videoId);
  const playList = await Playlist.findById(playlistId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!playList) {
    throw new ApiError(404, "Playlist not found");
  }

  // Ownership check
  if (!video.isOwner(req.user._id) || !playList.isOwner(req.user._id)) {
    throw new ApiError(403, "Only the owner can add videos to their playlist");
  }

  // Prevent duplicates
  if (playList.videos.includes(videoId)) {
    throw new ApiError(400, "Video is already in this playlist");
  }

  playList.videos.push(videoId);
  await playList.save();

  return res.status(200).json({
    success: true,
    message: "Video added to playlist successfully",
    playList,
  });
});

const removeVideoFromPlayList = asyncHandler(async (req, res) => {
  const { videoId, playListId } = req.params;
  // VideoId and PlaylistId are valid
  // Playlist Owner and video Owners are same to the req.user._id

  if (!isValidObjectId(videoId) || !isValidObjectId(playListId)) {
    throw new ApiError(400, "Invalid Video Id or PlaylistId");
  }

  const video = await Video.findById(videoId);
  const playList = await Playlist.findById(playListId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!playList) {
    throw new ApiError(404, "Playlist not found");
  }

  // Ownership check
  if (!video.isOwner(req.user._id) || !playList.isOwner(req.user._id)) {
    throw new ApiError(404, "Only owner can update their playlist");
  }

  const videoIx = playList.videos.findIndex((video) => video == videoId);

  if (videoIx == -1) {
    throw new ApiError(404, "Video is not in the playlist");
  }

  playList.videos.splice(videoIx, 1);
  await playList.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        playList,
        "Video removed from the playlist successfully"
      )
    );
});

export {
  createPlayList,
  getUserPlaylists,
  getPlaylistByPlaylistID,
  addVideoInPlayList,
  removeVideoFromPlayList,
  deletePlayList,
};
