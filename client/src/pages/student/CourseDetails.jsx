import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
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
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const params = useParams();
  const courseId = params.courseId;

  return (
    <>
      <div className="w-full font-sans mx-auto h-auto my-2 bg-[#2d2f31] dark:bg-gradient-to-r text-slate-100 dark:from-slate-900 dark:to-slate-700">
        <div className="w-10/12 mx-auto py-10">
          {/* Course Details */}
          <div>
            <h1 className="text-3xl font-bold">
              Master TailwindCSS In One Video
            </h1>
            <h3 className="text-lg font-medium my-3">
              Build Scalable React App Using Rahul Kumar
            </h3>
            <h5 className="">
              Created By:{" "}
              <span className="underline underline-offset-2 italic text-indigo-400">
                Rahul Kumar
              </span>{" "}
            </h5>
            <div className="flex items-center gap-1 my-1">
              <BadgeInfo size={16} />
              <p>Last Updated 11-11-2024</p>
            </div>
            <p className="my-1">Enrolled Students: 10</p>
          </div>
        </div>
      </div>
      {/* Main Section */}
      <div className="w-full md:w-10/12 mx-auto my-8 flex gap-32 flex-col md:flex-row items-center justify-between md:px-0 px-4">
        <div className="md:w-2/3 w-full px-0">
          <h1 className="text-3xl font-bold ">Description</h1>
          <p className="text-sm my-8 ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
            exercitationem laudantium molestiae, qui quas sapiente in voluptate
            ea dolorem quam atque quidem odio autem nobis quo magni! Dolor,
            totam quae. Lorem, ipsum dolor sit amet consectetur adipisicing
            elit. Animi temporibus ratione corrupti quod omnis laboriosam eaque
            minus debitis ducimus delectus!
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                <div className="my-2">4 Lectures</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {[1, 2].map((lecture, index) => {
                return (
                  <div key={index} className="flex items-center gap-2 mb-4">
                    {true ? (
                      <span>
                        <PlayCircle size={18} />
                      </span>
                    ) : (
                      <Lock size={18} />
                    )}
                    <p>Introduction</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <div className="md:w-1/3 w-full">
          <Card>
            <CardContent className="p-4 flex flex-col justify-center">
              <div className="aspect-video mb-4 ">react Player</div>

              <p>Lecture Title</p>
              <div className="w-full h-[3px] bg-gray-200"></div>
              <p className="font-bold text-lg">Course Content</p>
            </CardContent>
            <CardFooter className="px-4 justify-center">
              {false ? (
                <Button className="w-full">Contnue Course</Button>
              ) : (
                <BuyBtn courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
