import { useEffect, useState } from "react";
import Course from "./Course";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const MyLearning = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const myLearning = [];
  const [myLearning, setMyLearning] = useState([]);

  const fetchUserData = async () => {
    setIsLoading(true);
    const data = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}api/user/profile`,
      {
        withCredentials: true,
      }
    );
    setIsLoading(false);
    setMyLearning(data.data?.user?.enrolledCourses);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto my-10 px-4 md:px-0">
        <h1 className="font-bold text-2xl secFont">My Learning</h1>
        <div className="my-5 flex gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <MySkeleton key={i} />)
          ) : (
            <div>
              {myLearning.length === 0 ? (
                <p>You are not enrolled in any course.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {myLearning.map((course, index) => (
                    <Course key={index} courseDetails={course} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;

// Skeleton component for loading state
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
