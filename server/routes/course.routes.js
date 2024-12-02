import express from "express";
import { handleCreateCourse, handleCreateLecture, handleEditCourse, handleEditLecture, handleGetCourseByCourseId, handleGetCourseLecture, handleGetCreatorCourses, handleGetLectureById, handleRemoveLecture, handleTogglePublishCourse } from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
import { IsAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/").post(IsAuthenticated, handleCreateCourse);
// router.route("/search").get(IsAuthenticated, searchCourse);
// router.route("/published-courses").get( getPublishedCourse);
router.route("/").get(IsAuthenticated, handleGetCreatorCourses);
router.route("/:courseId").put(IsAuthenticated, upload.single("courseThumbnail"), handleEditCourse);
router.route("/:courseId").get(IsAuthenticated, handleGetCourseByCourseId)
router.route("/:courseId/lecture").post(IsAuthenticated, handleCreateLecture);
router.route("/:courseId/lecture").get(IsAuthenticated, handleGetCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(IsAuthenticated, handleEditLecture);
router.route("/lecture/:lectureId").delete(IsAuthenticated, handleRemoveLecture);
router.route("/lecture/:lectureId").get(IsAuthenticated, handleGetLectureById);
router.route("/:courseId").patch(IsAuthenticated, handleTogglePublishCourse);


export default router;