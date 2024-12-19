import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty or in proper formate
  //check user already exist :using usernamae,email
  //files exist(check for images) - avatar
  //upload to cloudinary,avatar
  //creating user object - create entry in db
  //remove passwoed and refrest token field from response
  //check for user creation
  //return res

  const { fullName, email, userName, password } = req.body;
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({ $or: [{ userName }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "user with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }


  //await is used here because upload tackes some time
  const avatar = await uplodeOnCloudinary(avatarLocalPath);
  const coverImage = await uplodeOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    userName:userName.toLowerCase(),
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
  })

  //selecting which fields to exclude in db

  const createdUser = await User.findById(user._id).select(
    //these fields are not included in db
    "-password -refreshToken"
  );

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
  }
    
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
  )

  res.send({ msg: "recieved" });
});

export { registerUser };
