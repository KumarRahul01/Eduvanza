import { AlarmClock, BadgeInfo, Loader2, Lock, PlayCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BuyBtn from "@/components/BuyBtn";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const CourseDetails = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const [isLoading, setIsLoading] = useState(false);
  const [coursePurchased, setCoursePurchased] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [courseData, setCourseData] = useState({
    createdAt: "",
    enrolledStudents: 0,
    lectures: [],
    videoUrl: "",
  });

  const fetchCourseOnLoad = async () => {
    setIsLoading(true);
    try {
      const data = await axios.get(
        `http://localhost:3000/api/course/${courseId}`
      );
      setIsLoading(false);
      // console.log("Response", data.data);
      setCourseData(data.data?.course);
      setVideoUrl(data.data?.course?.lectures[0].videoUrl);
      if (data.data?.purchased === true) {
        setCoursePurchased(true);
      }
    } catch (error) {
      console.log("Error, courseDetails", error);
    }
  };

  const fetchDeatilsWhenCoursePurchased = async () => {
    setIsLoading(true);
    try {
      const data = await axios.get(
        `http://localhost:3000/api/details/course/${courseId}`
      );
      setIsLoading(false);
      // console.log("Response", data.data);
      setCourseData(data.data?.course);
      setVideoUrl(data.data?.course?.lectures[0].videoUrl);
      if (data.data?.purchased === true) {
        setCoursePurchased(true);
      }
    } catch (error) {
      console.log("Error, courseDetails, purchase", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      fetchCourseOnLoad();
    } else {
      fetchDeatilsWhenCoursePurchased();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex -my-20 items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" /> Loading ...
      </div>
    );
  }

  const randomPrice =
    (Math.floor(
      Math.random() *
        (Math.floor((courseData.coursePrice + 500) / 100) -
          Math.ceil((courseData.coursePrice + 100) / 100) +
          1)
    ) +
      Math.ceil((courseData.coursePrice + 100) / 100)) *
      100 +
    100;

  const handleContinueCourse = () => {
    if (coursePurchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <>
      <div className="w-full font-sans mx-auto h-auto my-2 bg-[#2d2f31] dark:bg-gradient-to-r text-slate-100 dark:from-slate-900 dark:to-slate-700">
        <div className="w-10/12 mx-auto py-10">
          {/* Course Details */}
          <div>
            <h1 className="text-3xl font-bold">
              {courseData.courseTitle || "Master TailwindCSS In One Video"}
            </h1>
            <h3 className="my-3">
              {courseData.subTitle ||
                "Build Scalable React App Using Rahul Kumar"}
            </h3>
            <h5 className="">
              Created By:{" "}
              <span className="underline underline-offset-2 italic text-indigo-400">
                {courseData.creator?.fullname || "Rahul Kumar"}
              </span>{" "}
            </h5>
            <div className="flex items-center gap-1 my-1">
              <BadgeInfo size={16} />
              <p>
                Last Updated{" "}
                {courseData.createdAt.split("T")[0] || "11 - 11 - 2024"}
              </p>
            </div>
            <p className="my-1">
              Enrolled Students: {courseData.enrolledStudents.length || 8}
            </p>
          </div>
        </div>
      </div>
      {/* Main Section */}
      <div className="w-full md:w-10/12 mx-auto my-8 flex md:gap-32 gap-20 flex-col md:flex-row justify-between md:px-0 px-4">
        <div className="md:w-2/3 h-auto w-full">
          <h1 className="text-3xl font-bold ">Description</h1>
          <p
            className="text-sm my-8 dark:text-gray-400"
            dangerouslySetInnerHTML={{
              __html: courseData.description || "Loading...",
            }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                <div className="my-2">4 Lectures</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {courseData.lectures.map((lecture, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 mb-4 dark:text-gray-400"
                  >
                    {lecture.isPreviewFree ? (
                      <span>
                        <PlayCircle size={18} />
                      </span>
                    ) : (
                      <Lock size={18} />
                    )}
                    <p>{lecture.lectureTitle}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <div className="md:w-1/3 w-full h-fit">
          <Card className="w-full py-4">
            <CardContent className="w-full flex flex-col items-start justify-center">
              <div className="w-full h-fit rounded-sm overflow-hidden mb-2">
                <video
                  className="aspect-video object-contain w-full"
                  src={videoUrl || "https://via.placeholder.com/150"}
                  controls
                />
              </div>

              <div className="w-full h-[2px] bg-gray-200 my-2"></div>
              <p className="font-bold text-lg line-clamp-1">
                {courseData.courseTitle || "Course Content"}
              </p>
              <p className="font-semibold mt-2">
                {" "}
                <span className="secFont">₹</span>{" "}
                <span className="mr-2 ">{courseData.coursePrice}</span>
                <span className="line-through">
                  {courseData.coursePrice + randomPrice || 199}
                </span>
              </p>
              {!coursePurchased && (
                <div className="text-red-600 text-sm flex justify-center items-center gap-1 my-2">
                  {" "}
                  <AlarmClock size={18} />{" "}
                  <p>
                    {" "}
                    <span className="font-semibold">1 hour</span> left at this
                    price!
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="">
              {coursePurchased ? (
                <Button
                  className="w-full dark:text-slate-100 dark:bg-gray-800 dark:hover:bg-gray-950 dark:hover:border font-semibold"
                  onClick={handleContinueCourse}
                >
                  Contnue Course
                </Button>
              ) : (
                <BuyBtn
                  isLoggedIn={isLoggedIn}
                  courseId={courseId}
                  price={courseData.coursePrice}
                  data={courseData}
                />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
