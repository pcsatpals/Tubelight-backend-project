import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const findAllVideos = asyncHandler(async (req, res) => {
  // Get params from the request
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  // Define the sorting order type to use in mongoose
  const sortingOrder = sortType == "asc" ? 1 : -1;

  // Initial Empty Pipeline Array
  const pipeline = [];

  if (query?.trim() !== "") {
    // Push match command if query is not empty
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { videoFile: { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  if (userId && isValidObjectId(userId)) {
    //Push if userID
    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  // To add or join the details of owner from the users table
  pipeline.push({
    $lookup: {
      as: "channel",
      from: "users",
      localField: "owner",
      foreignField: "_id",
    },
  });

  // replace array with single object
  pipeline.push({
    $unwind: "$channel",
  });

  // Sort data
  pipeline.push({
    $sort: {
      [sortBy]: sortingOrder,
    },
  });

  // Push the project to return only required data.
  pipeline.push({
    $project: {
      _id: 1,
      thumbnail: 1,
      title: 1,
      duration: 1,
      views: {
        $cond: {
          if: { $isArray: "$views" },
          then: { $size: "$views" },
          else: { $ifNull: ["$views", 0] },
        },
      },
      isPublished: 1,
      "channel._id": 1,
      "channel.username": 1,
      "channel.avatar": 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  // Apply pipeline array with the aggregate function.
  const videos = await Video.aggregate(pipeline, { page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishOrAddAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  // get title and description
  // get local path
  // upload to cloudinary
  // create a new video

  if (!(title || !description)) {
    throw new ApiError(400, "Title and description fields are require");
  }
  console.log(req.files);
  const videoLocalPath = req.files?.video[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!(videoLocalPath || thumbnailLocalPath)) {
    throw new ApiError(400, "Video and thumbnail files are required");
  }

  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!(video || thumbnail)) {
    throw new ApiError(500, "Something we wrong, While uploading video");
  }

  const createdVideo = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: video.duration,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "Video created successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is invalid");
  }

  // Add user to views array only if not already present (unique view tracking)
  await Promise.all([
    Video.findByIdAndUpdate(
      videoId,
      { $addToSet: { views: req.user?._id } } // $addToSet ensures no duplicates
    ),
    User.findByIdAndUpdate(req.user?._id, { $push: { watchHistory: videoId } }),
  ]);

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
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
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    { $unwind: "$channel" },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        views: {
          $cond: {
            if: { $isArray: "$views" },
            then: { $size: "$views" },
            else: { $ifNull: ["$views", 0] },
          },
        },
        "channel.subscribersCount": { $size: "$subscribers" },
        "channel.isSubscribed": {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user._id),
                "$subscribers.subscriber",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        "channel._id": 1,
        "channel.avatar": 1,
        "channel.fullName": 1,
        "channel.subscribersCount": 1,
        "channel.username": 1,
        "channel.isSubscribed": 1,

        createdAt: 1,
        description: 1,
        duration: 1,
        likesCount: 1,
        title: 1,
        videoFile: 1,
        views: 1,
        isPublished: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Details Fetched Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is invalid");
  }

  const video = await Video.findById(videoId);

  if (!req.user._id.equals(video.owner)) {
    throw new ApiError(404, "Only owner can update their video");
  }

  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!(title || description)) {
    throw new ApiError(400, "Title and Description fields are required");
  }

  let thumbnailPath = "";

  if (thumbnailLocalPath) {
    let thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
      throw new ApiError(
        500,
        "Error while uploading thumbnail image on cloudinary"
      );
    }
    thumbnailPath = thumbnail.url;
  }

  video.title = title;
  video.description = description;
  video.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is invalid");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video is not found with this id");
  }

  if (!req.user._id.equals(video.owner)) {
    throw new ApiError(404, "Only owner can update their video");
  }

  video.deleteOne();

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video Deleted successfully"));
});

const togglePublish = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is invalid");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video is not found with this id");
  }

  video.isPublished = !video.isPublished;

  video.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        video,
        `Video ${video.isPublished ? "Published " : "unPublished "}successfully`
      )
    );
});

export {
  publishOrAddAVideo,
  findAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublish,
};
