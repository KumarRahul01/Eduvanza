import { Router } from "express";
import { IsAuthenticated } from "../middlewares/auth.js";
import { handleGetCourseProgress, handleMarkAsCompleted, handleMarkAsInCompleted, handleUpdateLectureProgress } from "../controllers/courseProgress.controller.js";

const router = Router();


router.route("/:courseId").get(IsAuthenticated, handleGetCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(IsAuthenticated, handleUpdateLectureProgress);
router.route("/:courseId/complete").post(IsAuthenticated, handleMarkAsCompleted);
router.route("/:courseId/incomplete").post(IsAuthenticated, handleMarkAsInCompleted);


export default router;