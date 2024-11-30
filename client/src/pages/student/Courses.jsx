import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import Course from "./Course";

const Courses = () => {
  const [isloading, setIsLoading] = useState(false);

  return (
    // Course Container
    <div>
      <div className="text-center mt-12 mb-2">
        <h1 className="text-3xl font-extrabold secFont">Our Courses</h1>
      </div>
      {/* Individual Course Container */}
      {isloading ? (
        <div className="flex items-center justify-center flex-wrap gap-8 mb-20">
          {Array.from({ length: 8 }).map((_, index) => {
            return <MySkeleton key={index} />;
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-8 mb-20">
          {Array.from({ length: 8 }).map((_, index) => {
            return <Course key={index} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;

const MySkeleton = () => {
  return (
    <div className="w-72 h-80 bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden mt-10">
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
