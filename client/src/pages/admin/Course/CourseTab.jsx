import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [isPageLoadded, SetIsPageLoadded] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPublishButton, setShowPublishButton] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
    isPublished: "",
  });

  const params = useParams();
  const courseId = params.courseId;

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchCourseById = async () => {
      SetIsPageLoadded(false);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/course/${courseId}`
        );
        const courseData = response.data.course;
        SetIsPageLoadded(true);
        setIsPublished(courseData.isPublished);
        setInput({
          courseTitle: courseData.courseTitle,
          subTitle: courseData.subTitle,
          description: courseData.description,
          category: courseData.category,
          courseLevel: courseData.courseLevel,
          coursePrice: courseData.coursePrice,
          courseThumbnail: courseData.courseThumbnail,
        });
        setIsPublished(courseData.isPublished);
        const verifyShowPublishBtn =
          courseData.lectures.length > 0 ? true : false;
        setShowPublishButton(verifyShowPublishBtn);
      } catch (error) {
        console.log("Error in fetching course by id", error);
      } finally {
        SetIsPageLoadded(true);
      }
    };

    if (courseId) fetchCourseById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const updateCourseHandler = async () => {
    const formData = new FormData();

    if (input.courseTitle) formData.append("courseTitle", input.courseTitle);
    if (input.subTitle) formData.append("subTitle", input.subTitle);
    if (input.description) formData.append("description", input.description);
    if (input.category) formData.append("category", input.category);
    if (input.courseLevel) formData.append("courseLevel", input.courseLevel);
    if (input.coursePrice) formData.append("coursePrice", input.coursePrice);
    if (input.courseThumbnail) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }
    formData.append("courseId", courseId);

    try {
      setIsLoading(true);
      const data = await axios.put(
        `http://localhost:3000/api/course/${courseId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("Updated:", data.data.course);
      toast.success("Course details updated successfully");
      navigate(`lecture`);
    } catch (error) {
      console.log("Error in Updating course", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublishCourseHandler = async () => {
    try {
      const newPublishStatus = !isPublished; // Toggle the current status
      const res = await axios.put(
        `http://localhost:3000/api/course/${courseId}/course/?publish=${newPublishStatus}`,
        { isPublished: newPublishStatus }, // Update the backend
        { withCredentials: true }
      );

      if (res.status === 200) {
        // Update the local state based on the successful response
        setIsPublished(newPublishStatus);
        navigate("/admin/course");
        toast.success(
          `Course is ${newPublishStatus ? "Published" : "Unpublished"}`
        );
      } else {
        throw new Error("Failed to update publish status");
      }
    } catch (error) {
      console.log("Error in changing course status", error);
      toast.error("Failed to update the publish status");
    }
  };

  const removeCourseHandler = async () => {
    try {
      const course = await axios.delete(
        `http://localhost:3000/api/course/${courseId}`,
        {
          withCredentials: true,
        }
      );
      console.log("res", course);
      toast.success("Course deleted successfully");
      navigate("/admin/course");
    } catch (error) {
      console.log("Error in removing Course", error);
      toast.success("Error in deleting course");
    }
  };

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

  if (!isPageLoadded)
    return (
      <>
        <div className="mt-60 w-full flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </>
    );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription className="my-2">
            Make changes to your courses here. Click save when you&apos;re done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          {showPublishButton && (
            <Button variant="outline" onClick={togglePublishCourseHandler}>
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
          )}
          <Button onClick={removeCourseHandler}>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack developer"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select
                defaultValue={input.category}
                onValueChange={selectCategory}
                value={input.category}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {courseCategories.map((courseName, index) => (
                      <SelectItem value={courseName.toLowerCase()} key={index}>
                        {courseName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select
                defaultValue={input.courseLevel}
                onValueChange={selectCourseLevel}
                value={input.courseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              placeholder="Hello"
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail ? (
              <img
                src={previewThumbnail}
                className="w-[28rem] object-cover aspect-video my-6 border rounded-md"
                alt="Course thumbnail"
              />
            ) : (
              <img
                src={input.courseThumbnail}
                className="w-[28rem] aspect-video object-cover my-6 border rounded-md text-xs"
                alt="No thumbnail found, please upload"
              />
            )}
          </div>
          <div className="space-x-4">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
