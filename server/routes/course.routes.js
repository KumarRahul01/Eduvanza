import express from "express";
import { handleCreateCourse, handleCreateLecture, handleEditCourse, handleGetCourseByCourseId, handleGetCourseLecture, handleGetCreatorCourses } from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
import { IsAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/").post(IsAuthenticated, handleCreateCourse);
// router.route("/search").get(IsAuthenticated, searchCourse);
// router.route("/published-courses").get( getPublishedCourse);
router.route("/").get(IsAuthenticated, handleGetCreatorCourses);
router.route("/:courseId").put(IsAuthenticated, upload.single("courseThumbnail"), handleEditCourse);
// router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId").get(IsAuthenticated, handleGetCourseByCourseId)
router.route("/:courseId/lecture").post(IsAuthenticated, handleCreateLecture);
router.route("/:courseId/lecture").get(IsAuthenticated, handleGetCourseLecture);
// router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
// router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
// router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
// router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);


export default router;