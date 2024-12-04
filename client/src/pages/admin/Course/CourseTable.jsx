import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const CourseTable = () => {
  const [allCourses, setAllCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllPublishedCourses = async () => {
      try {
        const data = await axios.get("http://localhost:3000/api/course", {
          withCredentials: true,
        });
        // console.log(data?.data?.courses);
        setAllCourses(data?.data?.courses);
      } catch (error) {
        console.log("error aa gya", error);
      }
    };

    getAllPublishedCourses();
  }, []);

  return (
    <div>
      <Button onClick={() => navigate(`/admin/course/create`)}>
        Create a new course
      </Button>
      <Outlet />
      <Table className="my-10">
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCourses.map((course, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <span className="font-sans">₹ </span>
                {course?.coursePrice || "NA"}
              </TableCell>
              <TableCell>
                {" "}
                <Badge>{course.isPublished ? "Published" : "Draft"}</Badge>{" "}
              </TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`${course._id}`)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
