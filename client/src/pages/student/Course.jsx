/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Course = ({ courseDetails }) => {
  console.log(courseDetails);

  return (
    <Link to={`/course-detail/${courseDetails._id}`}>
      <Card className="overflow-hidden w-72 h-[340px]  rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mt-10">
        <div className="relative">
          <img
            src={
              courseDetails.courseThumbnail ||
              "https://cdn.pixabay.com/photo/2019/11/15/14/53/office-4628592_640.jpg"
            }
            alt="course"
            className="w-full h-52 object-cover rounded-t-lg border-b-2"
          />
        </div>
        <CardContent className="px-5 pt-2 pb-4 space-y-3">
          <h1 className="hover:underline underline-offset-2 font-bold text-lg truncate">
            {courseDetails.courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="rounded-full"
                  src={
                    courseDetails.creator?.photoUrl ||
                    "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm">
                {courseDetails.creator?.fullname || "demo"}
              </h1>
            </div>
            <Badge
              className={
                "bg-blue-600 text-white px-2 py-1 text-xs rounded-full"
              }
            >
              {courseDetails.courseLevel}
            </Badge>
          </div>
          <div className="text-lg font-bold">
            <span>₹{courseDetails.coursePrice}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
