import express from "express";
import { handleCoursePayment, handleCoursePaymentStatus } from "../controllers/coursePurchase.controller.js";
import { IsAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/order").post(IsAuthenticated, handleCoursePayment);
router.route("/status").post(handleCoursePaymentStatus);


export default router;