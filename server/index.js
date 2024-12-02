import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config()

import connectDB from "./db/db.js";
import userRoutes from "./routes/user.routes.js"
import courseRoutes from "./routes/course.routes.js"
import mediaRoutes from "./routes/media.routes.js"

const app = express()
const PORT = process.env.PORT;
const url = process.env.MONGODB_URI;

// Connecting to database
connectDB(url);

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes Middelwares
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes)
app.use("/api/media", mediaRoutes)




app.get("/", (req, res) => res.status(200).json({ msg: "Message from Express" }));

app.listen(PORT, () => {
  console.log(
    `server listening at ${PORT}`
  );
})