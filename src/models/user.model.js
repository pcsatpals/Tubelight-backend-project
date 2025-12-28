import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

const userSchema = new Schema(
  {
    username: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [
        function () {
          return this.provider === "local";
        },
        "Password is required for local login",
      ],
    },
    refreshToken: {
      type: String,
    },
    // NEW FIELDS FOR SOCIAL LOGIN
    provider: {
      type: String,
      enum: ["local", "google", "apple"],
      default: "local",
    },
    externalId: {
      type: String, // ID from Google/Apple
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // 1. GENERIC UNIQUE ID LOGIC (Only runs on first creation)
  if (this.isNew) {
    const slug = this.fullName
      ?.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Trim hyphens

    this.username = `${slug}-${nanoid(6)}`;
  }

  if (!this.password || !this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_SECRET_TOKEN,
    {
      expiresIn: process.env.ACCESS_SECRET_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_SECRET_TOKEN,
    {
      expiresIn: process.env.REFRESH_SECRET_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
