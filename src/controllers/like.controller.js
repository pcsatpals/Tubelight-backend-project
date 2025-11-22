import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  const isLiked = await Like.findOne({ video: videoId, likedBy: req.user._id });

  if (isLiked) {
    const like = await isLiked.deleteOne();
    await isLiked.save();
    return res.status(200).json(new ApiResponse(200, like, "Video Unliked"));
  } else {
    const like = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    return res.status(200).json(new ApiResponse(200, like, "Video Liked"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (isLiked) {
    const like = await isLiked.deleteOne();
    await isLiked.save();
    return res.status(200).json(new ApiResponse(200, like, "Video Unliked"));
  } else {
    const like = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    return res.status(200).json(new ApiResponse(200, like, "Video Liked"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "likedBy",
        foreignField: "_id",
        as: "channel",
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $project: {
        _id: 0,
        likedAt: "$createdAt",
        videoDetails: 1,
        "channel.username": 1,
        "channel.avatar": 1,
      },
    },
  ]);

  if (!likedVideos) {
    throw new ApiError(400, "Liked Videos Fetching Failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "All Liked Videos"));
});

export { toggleVideoLike, toggleCommentLike, getLikedVideos };
