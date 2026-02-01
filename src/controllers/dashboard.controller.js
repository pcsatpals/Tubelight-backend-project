import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

import mongoose from "mongoose";
const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos etc.

  /* 
    1. Looking to the User, look out to:
        a. videos
        b. subscriptions
        c. views
    */

  const user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $lookup: {
        from: "videos",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$owner", "$$userId"] },
            },
          },
          {
            $lookup: {
              from: "likes",
              let: { videoId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$video", "$$videoId"] },
                  },
                },
              ],
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "channel",
            },
          },
          { $unwind: "$channel" },
          {
            $addFields: {
              likesCount: {
                $cond: {
                  if: { $isArray: "$likes" },
                  then: { $size: "$likes" },
                  else: { $ifNull: ["$likes", 0] },
                },
              },
              views: {
                $cond: {
                  if: { $isArray: "$views" },
                  then: { $size: "$views" },
                  else: { $ifNull: ["$views", 0] },
                },
              },
            },
          },

          {
            $project: {
              title: 1,
              thumbnail: 1,
              description: 1,
              createdAt: 1,
              isPublished: 1,
              likesCount: 1,
              views: 1,
              duration: 1,
              channel: 1,
            },
          },
        ],
        as: "videosDetails",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscriptionsDetails",
      },
    },
    // join likes by matching video IDs
    {
      $lookup: {
        from: "likes",
        let: { userVideos: "$videosDetails._id" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$video", "$$userVideos"] },
            },
          },
        ],
        as: "likesDetails",
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$likesDetails" }, // count likes
        totalSubscribers: { $size: "$subscriptionsDetails" }, // count subscribers
      },
    },
    {
      $project: {
        username: 1,
        totalLikes: 1,
        totalSubscribers: 1,
        videosDetails: 1,
      },
    },
  ]);

  if (!user) {
    throw new ApiError(400, "Error Fetching Stats");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "Fetching Channel Stats Successful"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const videos = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(req.user._id) },
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
  ]);

  if (!videos) {
    throw new ApiError(400, "Fetching Channel Videos Failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Fetching Channel Videos Successful"));
});

export { getChannelStats, getChannelVideos };
