import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheckBig, CirclePlay, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currLecture, setCurrLecture] = useState(null);
  const [courseProgress, setCourseProgress] = useState({
    completed: "",
    courseDetails: { lectures: [] },
    progress: [],
  });

  const [completeCourseBtn, setCompleteCourseBtn] = useState(false);

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const handleGetCourseProgress = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/progress/${courseId}`
      );
      setCourseProgress(res.data?.data || { courseDetails: { lectures: [] } });
      if (res.data?.data.completed) {
        setCompleteCourseBtn(true);
      } else {
        setCompleteCourseBtn(false);
      }
    } catch (error) {
      console.error("Error in fetching progress", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLectureProgress = async (lectureId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/progress/${courseId}/lecture/${lectureId}/view`
      );
      // Update the local state to mark the lecture as completed
      setCourseProgress((prevProgress) => ({
        ...prevProgress,
        progress: [
          ...prevProgress.progress,
          { lectureId, viewed: true }, // Add the lecture as viewed
        ],
      }));
    } catch (error) {
      console.error("Error in updating lecture progress", error);
    }
  };

  const isLectureCompleted = (lectureId) => {
    return courseProgress.progress.some(
      (prog) => prog.lectureId === lectureId && prog.viewed
    );
  };

  useEffect(() => {
    handleGetCourseProgress();
  }, [completeCourseBtn]);

  const initialLecture =
    currLecture || courseProgress.courseDetails.lectures[0] || {};

  const handleSelectLecture = (lecture) => {
    setCurrLecture(lecture);
  };

  const handleVideoPlay = () => {
    if (currLecture?._id || initialLecture._id) {
      handleLectureProgress(currLecture?._id || initialLecture._id);
    }
  };

  const handleCompleteCourse = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/progress/${courseId}/complete`
      );
      setCompleteCourseBtn(true);
      toast.success("Congratulations course completed!");
    } catch (error) {
      console.log("Error in fetching complted course details", error);
    }
  };

  const handleIncompleteCourse = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/progress/${courseId}/incomplete`
      );
      toast.success("Course marked as Incompleted!");
      setCompleteCourseBtn(false);
    } catch (error) {
      console.log("Error in fetching Incomplted course details", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center my-40">
        <Loader2 className="w-12 h-12 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-auto my-2">
      <div className="w-10/12 mx-auto py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold px-6">
            {courseProgress.courseDetails?.courseTitle ||
              "Master Namaste JavaScript: From Beginner to Pro"}
          </h1>
          <Button
            className="hidden md:block dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white"
            onClick={
              completeCourseBtn ? handleIncompleteCourse : handleCompleteCourse
            }
            variant={courseProgress.completed ? "outline" : "default"}
          >
            {courseProgress.completed ? (
              <div className="flex items-center gap-2 ">
                <CircleCheckBig size={24} />
                <span>Completed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 ">
                <span>Mark as completed</span>
              </div>
            )}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-10 mb:mb-8">
          <div className="rounded-lg shadow-xl md:w-3/5 overflow-hidden h-fit">
            <div className="overflow-hidden rounded-md w-full aspect-video px-6 pt-6">
              <video
                src={
                  currLecture?.videoUrl ||
                  initialLecture.videoUrl ||
                  "https://via.placeholder.com/"
                }
                className="rounded-sm shadow w-full h-auto"
                controls
                onPlay={handleVideoPlay}
              />
            </div>
            <h1 className="p-6 text-lg -my-3 h-fit font-semibold">
              {`Lecture ${
                courseProgress.courseDetails.lectures.findIndex(
                  (lec) => lec._id === (currLecture?._id || initialLecture._id)
                ) + 1
              } : ${currLecture?.lectureTitle || initialLecture.lectureTitle}`}
            </h1>
          </div>

          {!isLoading && (
            <div className="md:w-2/5 h-fit border-l py-4 overflow-hidden">
              <div className="flex flex-col ml-2">
                <h1 className="font-bold text-lg px-4">Course Lectures</h1>
                {(courseProgress.courseDetails.lectures || []).map(
                  (lecture, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 my-2 border rounded-lg p-4 cursor-pointer  dark:hover:bg-gray-800 hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-300 ${
                        lecture._id === initialLecture._id
                          ? "bg-gray-300 dark:bg-gray-600"
                          : "bg-transparent"
                      }`}
                      onClick={() => handleSelectLecture(lecture)}
                    >
                      <div>
                        {isLectureCompleted(lecture._id) ? (
                          <CircleCheckBig
                            size={24}
                            className="text-green-500"
                          />
                        ) : (
                          <CirclePlay size={24} />
                        )}
                      </div>
                      <div className="w-full flex items-center justify-between gap-2">
                        <p>{lecture.lectureTitle}</p>
                        {isLectureCompleted(lecture._id) && (
                          <Badge className="text-green-700 bg-green-300">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
