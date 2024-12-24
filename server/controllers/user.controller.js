import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const handleUserSignUp = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" })
  }

  try {
    // Make sure email is lowercase
    const lowercaseEmail = email?.toLowerCase();

    // Check if the email or username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const existingEmail = await User.findOne({ lowercaseEmail });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // create new user
    const user = await User.create({
      fullname, username, email: lowercaseEmail, password
    });

    return res.status(201).json({ msg: "User Registered Successfully!", user })

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Signup Error" });
  }
}


export const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);


  try {
    // const lowercaseEmail = email?.toLowerCase();

    // Ensure required fields are provided
    if (!password || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find user by either username or email
    // const user = await User.findOne({ email: lowercaseEmail });
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });


    // set cookie
    res.cookie("uid", token, {
      // httpOnly: true,  // Protects cookie from JavaScript access
      // secure: process.env.NODE_ENV === "production", // For secure cookie in production (requires HTTPS)
      // sameSite: "Strict", // Optional: Helps prevent CSRF
      maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day
    });

    // send response
    return res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("User Login error", error);
    res.status(500).json({ error: "Internal Server Login Error" });
  }
}

export const handleUserLogout = async (req, res) => {
  try {
    // Clear the cookie without specifying a path
    res.clearCookie("uid");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("User Logout error:", error);
    res.status(500).json({ error: "Failed to logout" });
  }
};



export const handleGetUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("userId", userId);
    if (!userId) {
      return res.status(401).json({ message: "User not loggedIn" })
    }

    const user = await User.findById(userId).select("-password").populate({ path: "enrolledCourses" });
    if (!user) {
      return res.status(404).json({ message: "Profile not found" })
    }
    return res.status(200).json({ message: "Fetched User Profile successfully!", user });
  } catch (error) {
    console.error("Error in getting profile:", error);
    res.status(500).json({ error: "Failed to get user profile" });
  }
}

export const handleEditUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { name } = req.body;
    const profilePhoto = req.file;

    console.log(name, profilePhoto);

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not Found" })
    }

    // extract public id of the old image from the url is it exists;
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
      deleteMediaFromCloudinary(publicId);
    }

    // upload new photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    const updatedData = { fullname: name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully."
    })

  } catch (error) {
    console.error("Update User Details error:", error);
    res.status(500).json({ error: "Failed to Update User Details" });
  }
}