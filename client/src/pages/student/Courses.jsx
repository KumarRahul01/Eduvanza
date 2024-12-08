import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Course from "./Course";
import axios from "axios";

const Courses = () => {
  const [isloading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchAllCourses = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/course/published-courses`,
        {
          withCredentials: true,
        }
      );
      // console.log("Response", res);
      setData(res.data.courses);
      setIsLoading(false);
    } catch (error) {
      console.log("Error in fetching courses", error);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  return (
    // Course Container
    <div>
      <div className="text-center mt-12 mb-2">
        <h1 className="text-3xl font-semibold ">Our Courses</h1>
      </div>
      {/* Individual Course Container */}
      {isloading ? (
        <div className="flex items-center justify-center flex-wrap gap-8 mb-20">
          {data.map((_, index) => {
            return <MySkeleton key={index} />;
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-8 mb-20">
          {data.map((course, index) => {
            return <Course key={index} courseDetails={course} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;

const MySkeleton = () => {
  return (
    <div className="w-72 h-80 border shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden mt-10">
      <Skeleton className="w-full h-48" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
