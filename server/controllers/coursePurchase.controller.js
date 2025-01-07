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
      console.log("All fields are required");
      return res.status(400).json({ error: "All fields are required" });
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
      merchantTransactionId,
      name: req.body.name,
      amount: req.body.amount * 100, // Convert to paise
      redirectUrl: `${process.env.BACKEND_URL}api/payment/status?id=${merchantTransactionId}`,
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
    // const sha256 = SHA256(string).toString();
    // const checksum = `${sha256}###${keyIndex}`;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

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
    return res.json(response.data);
  } catch (error) {
    console.error("Error Response:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || "Internal Server Error" });
  }
};

// Verify payment

// export const handleCoursePayment = async (req, res) => {
//   try {
//     const { name, email, phone, amount, courseId, transactionId } = req.body;
//     const userId = req.userId;

//     if (!name || !email || !phone) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     await CoursePurchase.create({
//       courseId, userId, amount, paymentId: transactionId
//     });

//     const data = {
//       merchantId: process.env.MERCHANT_ID,
//       merchantTransactionId: transactionId,
//       name,
//       amount: amount * 100, // Convert to paise
//       redirectUrl: `${process.env.BACKEND_URL}/api/payment/status?id=${transactionId}`,
//       redirectMode: 'POST',
//       mobileNumber: phone,
//       paymentInstrument: { type: 'PAY_PAGE' },
//     };

//     const payload = JSON.stringify(data);
//     const payloadMain = Buffer.from(payload).toString('base64');
//     const string = `${payloadMain}/pg/v1/pay${process.env.SALT_KEY}`;
//     const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//     const checksum = `${sha256}###1`;

//     const options = {
//       method: 'POST',
//       url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
//       headers: {
//         accept: 'application/json',
//         'Content-Type': 'application/json',
//         'X-VERIFY': checksum,
//       },
//       data: { request: payloadMain },
//     };

//     const response = await axios(options);
//     return res.json(response.data);

//   } catch (error) {
//     console.error("Error Response:", error.response?.data || error.message);
//     return res.status(500).json({ error: error.response?.data || "Internal Server Error" });
//   }
// };


// export const handleCoursePaymentStatus = async (req, res) => {

//   const merchantTransactionId = req.query.id;
//   const merchantId = process.env.MERCHANT_ID;

//   const keyIndex = 1;
//   const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
//   // const sha256 = SHA256(string).toString();
//   // const checksum = sha256 + '###' + keyIndex;
//   const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//   const checksum = sha256 + '###' + keyIndex;


//   const options = {
//     method: 'GET',
//     url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
//     headers: {
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//       'X-VERIFY': checksum,
//       'X-MERCHANT-ID': `${merchantId}`
//     }
//   }

//   axios.request(options).then(function (response) {
//     if (response.data.success === true) {
//       updateCoursePurchase();

//       const url = `${process.env.FRONTEND_URL}/payment-success`
//       return res.redirect(url)


//     } else {
//       const url = `${process.env.FRONTEND_URL}/payment-failed`
//       return res.redirect(url)
//     }


//   }).catch(function (error) {
//     console.error(error);
//   })

//   const updateCoursePurchase = async () => {
//     const myPurchase = await CoursePurchase.findOne({ paymentId: myTransactionId }).populate({ path: "courseId" });

//     if (!myPurchase) {
//       console.error("CoursePurchase not found for transaction ID:", myTransactionId);
//       return null;
//     }

//     // Update the payment status to "completed"
//     const updatedData = { paymentStatus: "completed" };
//     const updatedCoursePurchase = await CoursePurchase.findByIdAndUpdate(
//       myPurchase._id,
//       { $set: updatedData },
//       { new: true }
//     );

//     console.log("Updated CoursePurchase:", updatedCoursePurchase);

//     // Ensure lectures exist and are an array
//     if (myPurchase.courseId && myPurchase.courseId.lectures.length > 0) {
//       console.log("Lectures to update:", myPurchase.courseId.lectures);

//       // Convert lecture IDs to ObjectId if necessary

//       await Lecture.updateMany(
//         { _id: { $in: myPurchase.courseId.lectures } }, // Filter by lecture IDs
//         { $set: { isPreviewFree: true } }
//       );
//     } else {
//       console.error("No lectures found to update");
//     }

//     await myPurchase.save();

//     // Update user's enrolledCourses
//     await User.findByIdAndUpdate(
//       myPurchase.userId,
//       { $addToSet: { enrolledCourses: myPurchase.courseId._id } },
//       { new: true }
//     );

//     // Update course to add user ID to enrolledStudents
//     await Course.findByIdAndUpdate(
//       myPurchase.courseId._id,
//       { $addToSet: { enrolledStudents: myPurchase.userId } },
//       { new: true }
//     );
//   };
// };

export const handleCoursePaymentStatus = async (req, res) => {
  try {
    const merchantTransactionId = req.query.id;
    const merchantId = process.env.MERCHANT_ID;

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    const options = {
      method: 'GET',
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`,
      },
    };

    const response = await axios.request(options);

    if (response.data.success === true) {
      await updateCoursePurchase(merchantTransactionId);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
  } catch (error) {
    console.error("Error in payment status verification:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || "Internal Server Error" });
  }
};

// Helper function to update course purchase details
const updateCoursePurchase = async (transactionId) => {
  try {
    const myPurchase = await CoursePurchase.findOne({ paymentId: transactionId }).populate({ path: "courseId" });

    if (!myPurchase) {
      console.error("CoursePurchase not found for transaction ID:", transactionId);
      return;
    }

    // Update payment status
    myPurchase.paymentStatus = "completed";
    await myPurchase.save();

    console.log("Updated CoursePurchase:", myPurchase);

    // Ensure course has lectures and update them
    if (myPurchase.courseId?.lectures?.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: myPurchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
      console.log("Lectures updated successfully.");
    } else {
      console.warn("No lectures found to update.");
    }

    // Update user's enrolled courses
    await User.findByIdAndUpdate(
      myPurchase.userId,
      { $addToSet: { enrolledCourses: myPurchase.courseId._id } },
      { new: true }
    );
    console.log("User's enrolled courses updated.");

    // Update course to add user as an enrolled student
    await Course.findByIdAndUpdate(
      myPurchase.courseId._id,
      { $addToSet: { enrolledStudents: myPurchase.userId } },
      { new: true }
    );
    console.log("Course's enrolled students updated.");
  } catch (error) {
    console.error("Error updating course purchase:", error.message);
  }
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
