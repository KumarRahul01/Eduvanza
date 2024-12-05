/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  // const course = {
  //   id: "1234567890",
  //   courseThumbnail: "",
  //   courseTitle: "",
  //   subTitle: "",
  //   creatore: { name: "Rahul" },
  //   coursePrice: 200,
  //   courseLevel: "Normal",
  // };
  return (
    <div className="w-10/12 mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={
            course.courseThumbnail ||
            "https://res.cloudinary.com/djys5lfcs/image/upload/v1733404977/h8cdrmvfc8ztk0oy61un.webp"
          }
          alt="course-thumbnial"
          className="h-32 w-full md:w-56 object-cover rounded"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl">
            {course.courseTitle || "Namaste JavaScript"}
          </h1>
          <p className="text-sm text-gray-600">{course.subTitle || "Demo"}</p>
          <p className="text-sm text-gray-700">
            Intructor:{" "}
            <span className="font-bold">{course.creator?.name || "Rahul"}</span>{" "}
          </p>
          <Badge className="w-fit mt-2 md:mt-0">
            {course.courseLevel || "Normal"}
          </Badge>
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <h1 className="font-bold text-lg md:text-xl">
          ₹{course.coursePrice || 100}
        </h1>
      </div>
    </div>
  );
};

export default SearchResult;
