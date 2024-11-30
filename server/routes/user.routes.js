import { Router } from "express";
import { handleEditUserProfile, handleGetUserProfile, handleUserLogin, handleUserLogout, handleUserSignUp } from "../controllers/user.controller.js";
import { IsAuthenticated } from "../middlewares/auth.js";
import upload from "../utils/multer.js";

const router = Router();

router.route("/signup").post(handleUserSignUp);
router.route("/login").post(handleUserLogin);
router.route("/logout").get(handleUserLogout);
router.route("/profile").get(IsAuthenticated, handleGetUserProfile);
router.route("/profile/update").put(IsAuthenticated, upload.single("profilePhoto"), handleEditUserProfile);

export default router;