import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [lectureData, setLectureData] = useState([]);
  const [lectureError, setLectureError] = useState(null);

  const navigate = useNavigate();
  const { courseId } = useParams();

  // Fetch lectures
  const fetchLectures = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/course/${courseId}/lecture`,
        { withCredentials: true }
      );
      setLectureData(res.data.lectures);
    } catch (error) {
      setLectureError("Failed to load lectures.");
      console.error(
        "Fetch Lectures Error:",
        error.response?.data?.error || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a new lecture
  const createLectureHandler = async () => {
    if (!lectureTitle) {
      toast.error("Lecture title is required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/course/${courseId}/lecture`,
        { lectureTitle },
        { withCredentials: true }
      );
      setLectureData((prev) => [...prev, res.data.lecture]); // Add new lecture to the existing list
      setLectureTitle("");
      toast.success("Lecture Created Successfully!");
    } catch (error) {
      console.error(
        "Create Lecture Error:",
        error.response?.data?.error || error.message
      );
      toast.error("Failed to create the lecture!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lectures on component mount
  useEffect(() => {
    fetchLectures();
  }, []);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let’s add a lecture. Add some basic details for your new course.
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
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Lecture Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back To Course
          </Button>
          <Button disabled={loading} onClick={createLectureHandler}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
        {/* Display the lectures */}
        <div className="mt-10">
          {loading && lectureData.length === 0 ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>{lectureError}</p>
          ) : lectureData.length === 0 ? (
            <p>No lectures available</p>
          ) : (
            lectureData.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
