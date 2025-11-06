import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    // Do not need to check validation while refreshing tokens
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (er) {
    console.log(er);
    throw new ApiError(
      500,
      "Something went wrong while generating Refresh and Access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from the client
  // Validation -not empty
  // Check if user already exists
  // Check for images, check for avatar
  // If available then upload them into cloudinary, avatar uploaded successfully
  // Create user Object - create entry in DB
  // Remove password and refresh token failed from response
  // check for user creation
  // return res

  const { username, email, fullName, password } = req.body;
  console.log(req.body);
  const isBodyValidate = [username, email, fullName, password].some(
    (field) => field.trim() != ""
  );

  if (!isBodyValidate) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username is Already Exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar files are required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the image, Try by using another Image"
    );
  }

  const user = await User.create({
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
    fullName,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Get credentials from the client
  // All fields like email/username and password are still there
  // User find
  // password check
  // need to generate access and refresh token
  // send tokens into cookies
  // return response

  const { username, email, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiError(400, "User does not exist");

  // Get methods from the user because we are getting user from the db and we have instance of user
  // console.log(user);
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Get user without password and refresh token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpsOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logOutUser = async (req, res) => {
  // Get user from the middleware using req.user
  // Delete Cookies
  // Delete tokens

  const user = req.user;
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  console.log(updatedUser);

  const options = {
    httpsOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(200, {}, "User Logout Successfully");
};

export { registerUser, loginUser, logOutUser };
