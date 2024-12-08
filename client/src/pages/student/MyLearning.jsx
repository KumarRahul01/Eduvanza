import { useEffect, useState } from "react";
import Course from "./Course";
import axios from "axios";

const MyLearning = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const myLearning = [];
  const [myLearning, setMyLearning] = useState([]);

  const fetchUserData = async () => {
    const data = await axios.get(`http://localhost:3000/api/user/profile`, {
      withCredentials: true,
    });
    console.log(data);
    setIsLoading(false);
    setMyLearning(data.data?.user?.enrolledCourses);
    console.log("My LEARNING", myLearning);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto my-10 px-4 md:px-0">
        <h1 className="font-bold text-2xl secFont">My Learning</h1>
        <div className="my-5">
          {isLoading ? (
            <MyLearningSkeleton />
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
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
