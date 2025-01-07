import express from "express";
import { handleCoursePayment, handleCoursePaymentStatus, handleGetAllPurchasedCourse, handleGetCourseDetailWithPurchaseStatus } from "../controllers/coursePurchase.controller.js";
import { IsAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/order").post(IsAuthenticated, handleCoursePayment);
router.route("/status").post(handleCoursePaymentStatus);

// For Instructor Dashboard
router.route("/dashboard").get(IsAuthenticated, handleGetAllPurchasedCourse);

// For Student To show purchased Courses
router.route("/:courseId").get(IsAuthenticated, handleGetCourseDetailWithPurchaseStatus);



export default router;