import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Student", "Instructor"],
    default: "Student",
    required: true
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  photoUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();
    // Hash the password:
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Proceed to save
    next();
  } catch (error) {
    // Pass the error to the next middleware
    next(error)
  }

})

export const User = mongoose.model("user", userSchema);