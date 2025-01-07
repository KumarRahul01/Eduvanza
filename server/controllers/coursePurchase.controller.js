import SHA256 from 'crypto-js/sha256.js';
import axios from 'axios';
import { CoursePurchase } from '../models/coursePurchase.model.js';
import { Course } from '../models/course.model.js';
import { Lecture } from '../models/lecture.model.js';
import { User } from '../models/user.model.js';

let myTransactionId;

export const handleCoursePayment = async (req, res) => {

  try {

    const { name, email, phone, amount, courseId, transactionId } = req.body;
    const userId = req.userId;

    myTransactionId = transactionId;


    if (!name || !email || !phone) {
      console.log("All fields are required")
      return res.status(400).json({ msg: "All fields are required" });
    }

    // create CoursePurchase collection
    await CoursePurchase.create({
      courseId, userId, amount, paymentId: transactionId
    })

    // console.log("coursePurchase mOdel", coursePurchase);

    // console.log("demo payment", req.userId);
    const merchantTransactionId = req.body.transactionId;
    const data = {
      merchantId: process.env.MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      name: req.body.name,
      amount: req.body.amount * 100, // Convert to Rupees
      mobileNumber: req.body.phone,
      // redirectUrl: `${process.env.BACKEND_URL}/api/payment/status?id=${merchantTransactionId}`,
      redirectUrl: `https://eduvanza-jeva.onrender.com/api/payment/status?id=${merchantTransactionId}`,
      redirectMode: 'POST',
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString('base64');
    const keyIndex = 1;
    const string = `${payloadMain}/pg/v1/pay${process.env.SALT_KEY}`;
    const sha256 = SHA256(string).toString();
    const checksum = `${sha256}###${keyIndex}`;

    // PRODUCTION URL = 'http://api.phonepe.com/apis/hermes/pg/v1/pay'

    const test_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    // DATA send with request

    const options = {
      method: 'POST',
      url: test_URL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    const response = await axios(options);
    console.log(response.data);
    return res.json(response.data);
  } catch (error) {
    console.error("Error Response:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || "Internal Server Error" });
  }
};

// Verify payment
export const handleCoursePaymentStatus = async (req, res) => {

  const merchantTransactionId = req.query.id;
  const merchantId = process.env.MERCHANT_ID;

  const keyIndex = 1;
  const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
  const sha256 = SHA256(string).toString();
  const checksum = sha256 + '###' + keyIndex;

  const options = {
    method: 'GET',
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': `${merchantId}`
    }
  }


  const updateCoursePurchase = async () => {
    const myPurchase = await CoursePurchase.findOne({ paymentId: myTransactionId }).populate({ path: "courseId" });

    if (!myPurchase) {
      console.error("CoursePurchase not found for transaction ID:", myTransactionId);
      return null;
    }

    // Update the payment status to "completed"
    const updatedData = { paymentStatus: "completed" };
    const updatedCoursePurchase = await CoursePurchase.findByIdAndUpdate(
      myPurchase._id,
      { $set: updatedData },
      { new: true }
    );

    console.log("Updated CoursePurchase:", updatedCoursePurchase);

    // Ensure lectures exist and are an array
    if (myPurchase.courseId && myPurchase.courseId.lectures.length > 0) {
      console.log("Lectures to update:", myPurchase.courseId.lectures);

      // Convert lecture IDs to ObjectId if necessary

      await Lecture.updateMany(
        { _id: { $in: myPurchase.courseId.lectures } }, // Filter by lecture IDs
        { $set: { isPreviewFree: true } }
      );
    } else {
      console.error("No lectures found to update");
    }

    await myPurchase.save();

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(
      myPurchase.userId,
      { $addToSet: { enrolledCourses: myPurchase.courseId._id } },
      { new: true }
    );

    // Update course to add user ID to enrolledStudents
    await Course.findByIdAndUpdate(
      myPurchase.courseId._id,
      { $addToSet: { enrolledStudents: myPurchase.userId } },
      { new: true }
    );
  };



  axios.request(options).then(function (response) {


    if (response.data.success === true) {
      updateCoursePurchase()
      const url = `https://eduvanza.vercel.app/payment-success`
      return res.redirect(url)


    } else {
      const url = `https://eduvanza.vercel.app/payment-failed`
      return res.redirect(url)
    }


  }).catch(function (error) {
    console.error(error);
  })
};

export const handleGetCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;


    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });


    // console.log("userId:", userId, "courseId:", courseId);
    const purchased = await CoursePurchase.findOne({ userId, courseId });
    // console.log("purchase", purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

export const handleGetAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      paymentStatus: "completed",
    }).populate("courseId").populate("userId").select("-password");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};
