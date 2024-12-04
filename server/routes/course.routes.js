import express from "express";
import { handleCreateCourse, handleCreateLecture, handleEditCourse, handleEditLecture, handleGetCourseByCourseId, handleGetCourseLecture, handleGetCreatorCourses, handleGetLectureById, handleGetPublishedCourse, handleRemoveCourse, handleRemoveLecture, handleTogglePublishCourse } from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
import { IsAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

// router.route("/search").get(IsAuthenticated, searchCourse);
router.route("/published-courses").get(handleGetPublishedCourse);
router.route("/").get(IsAuthenticated, handleGetCreatorCourses);


router.route("/create").post(IsAuthenticated, handleCreateCourse);

// /:courseId
router.route("/:courseId").put(IsAuthenticated, upload.single("courseThumbnail"), handleEditCourse);
router.route("/:courseId").get(IsAuthenticated, handleGetCourseByCourseId)
router.route("/:courseId").delete(IsAuthenticated, handleRemoveCourse)


// /:courseId/lecture
router.route("/:courseId/lecture").post(IsAuthenticated, handleCreateLecture);
router.route("/:courseId/lecture").get(IsAuthenticated, handleGetCourseLecture);

// /:courseId/:lectureId
router.route("/lecture/:lectureId").delete(IsAuthenticated, handleRemoveLecture);
router.route("/lecture/:lectureId").get(IsAuthenticated, handleGetLectureById);

// /:courseId/lecture/:lectureId
router.route("/:courseId/lecture/:lectureId").post(IsAuthenticated, handleEditLecture);

// /:courseId/course
router.route("/:courseId/course").put(IsAuthenticated, handleTogglePublishCourse);


export default router;