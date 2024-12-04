import SHA256 from 'crypto-js/sha256.js';
import axios from 'axios';
import { CoursePurchase } from '../models/coursePurchase.model.js';
import { Course } from '../models/course.model.js';

let myTransactionId;

export const handleCoursePayment = async (req, res) => {

  try {

    const { name, email, phone, amount, courseId, transactionId } = req.body;
    const userId = req.userId;

    myTransactionId = transactionId;

    console.log({
      name, email, phone, amount, userId, courseId, transactionId
    });

    const coursePurchase = await CoursePurchase.create({
      courseId, userId, amount, paymentId: transactionId
    })

    console.log("coursePurchase mOdel", coursePurchase);

    // console.log("demo payment", req.userId);
    const merchantTransactionId = req.body.transactionId;
    const data = {
      merchantId: process.env.MERCHANT_ID,
      merchantTransactionId,
      name: req.body.name,
      amount: req.body.amount * 100, // Convert to paise
      redirectUrl: `${process.env.BACKEND_URL}/api/payment/status?id=${merchantTransactionId}`,
      redirectMode: 'POST',
      mobileNumber: req.body.phone,
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

    const test_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
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
    // console.log(response.data);
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
  // const sha256 = crypto.createHash('sha256').update(string).digest('hex');
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
    const myPurchase = await CoursePurchase.findOne({ paymentId: myTransactionId });

    if (!myPurchase) {
      console.error("CoursePurchase not found for transaction ID:", myTransactionId);
      return null; // Exit the function if no document is found
    }

    // Update the payment status to "completed"
    const updatedData = { paymentStatus: "completed" };
    const updatedCoursePurchase = await CoursePurchase.findByIdAndUpdate(
      myPurchase._id, // Use the `_id` of the found document
      { $set: updatedData }, // Use $set to update specific fields
      { new: true } // Return the updated document
    );

    console.log("Updated CoursePurchase:", updatedCoursePurchase);
  }



  axios.request(options).then(function (response) {


    if (response.data.success === true) {
      updateCoursePurchase();
      const url = `${process.env.FRONTEND_URL}/payment-success`
      return res.redirect(url)


    } else {
      const url = `${process.env.FRONTEND_URL}/payment-failed`
      return res.redirect(url)
    }


  }).catch(function (error) {
    console.error(error);
  })
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

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

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      paymentStatus: "completed",
    }).populate("courseId");
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
