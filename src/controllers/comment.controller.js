import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const comments = await Comment.aggregatePaginate(
    [
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "commentor",
        },
      },
      {
        $unwind: "$commentor",
      },
      {
        $project: {
          _id: 1,
          content: 1,
          video: 1,
          "commentor._id": 1,
          "commentor.username": 1,
          "commentor.fullName": 1,
          "commentor.avatar": 1,
        },
      },
    ],
    { page, limit }
  );

  if (!comments) {
    throw new ApiError(
      500,
      "Something went wrong while getting comments for this video"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  if (!isValidObjectId(videoId) || !videoId) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created Successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  if (!isValidObjectId(commentId) || !commentId) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment.isOwner(req.user._id)) {
    throw new ApiError(400, "Only owner can update his comment");
  }

  comment.content = content;
  await comment.save();

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment updated Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  if (!isValidObjectId(commentId) || !commentId) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment.isOwner(req.user._id)) {
    throw new ApiError(400, "Only owner can delete his comment");
  }

  const deletedComment = await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted Successfully"));
});

export { addComment, updateComment, deleteComment, getVideoComments };
