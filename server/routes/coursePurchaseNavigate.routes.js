import { Router } from "express";
import { handleGetAllPurchasedCourse, handleGetCourseDetailWithPurchaseStatus } from "../controllers/coursePurchase.controller.js";
import { IsAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.route("/course/:courseId").get(IsAuthenticated, handleGetCourseDetailWithPurchaseStatus);
router.route("/").get(IsAuthenticated, handleGetAllPurchasedCourse);

export default router;