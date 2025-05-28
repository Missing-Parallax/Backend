import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { json } from "express";

const registerUser = asyncHandler(async (req, res) => {
  //get user details
  const { fullname, username, email, password } = req.body;

  //validation
  if (fullname.trim() === "") {
    throw new ApiError(400, "Fullname is required");
  }
  if (email.trim() === "") {
    throw new ApiError(400, "Email is required");
  }
  if (username.trim() === "") {
    throw new ApiError(400, "Username is required");
  }
  if (password.trim() === "") {
    throw new ApiError(400, "Password is required");
  }

  //check if user already exists -> email and username
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) throw new ApiError(409, "Username or email already exists");

  //check for images, check for avatar

  const avatarLocalpath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalpath) throw new ApiError(400, "Avatar is required");

  //upload avatar to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalpath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar is required");

  //create user object - entry in db

  const user = await User.create({
    username: username.toLowercase(),
    avatar: avatar.url,
    email,
    password,
    coverImage: coverImage?.url || "",
    fullname,
  });

  //check for user creation and remove password and refresh token in response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, " Something went wrong while registering a user");

  //return res
  return res
    .status(201)
    .json(new ApiResponse(200, registerUser, "User registered successfully"));
});

export { registerUser };
