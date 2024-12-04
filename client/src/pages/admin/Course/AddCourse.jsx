import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const courseCategories = [
    "Next JS",
    "Data Science",
    "Frontend Development",
    "Backend Development",
    "Fullstack Development",
    "MERN Stack Development",
    "JavaScript",
    "Python",
    "Java",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "HTML",
    "CSS",
  ];

  const createCourseHandler = async () => {
    if (!courseTitle || !category) {
      toast.error("Please fill in all fields!");
      return;
    }

    const formData = {
      courseTitle,
      category,
    };

    console.log(formData);

    try {
      setIsLoading(true);
      await axios.post("http://localhost:3000/api/course/create", formData, {
        withCredentials: true,
      });
      setIsLoading(false);
      console.log("Course Created!");
      toast.success("Course Created Successfully!");
      navigate("/admin/course");
    } catch (error) {
      setIsLoading(false);
      console.error(
        "Create Course Error",
        error.response?.data?.error || error.message
      );
      toast.error("Failed to create the course!");
    }
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let’s add a course. Add some basic details for your new course.
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your Course Name"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {courseCategories.map((courseName, index) => (
                  <SelectItem value={courseName} key={index}>
                    {courseName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
