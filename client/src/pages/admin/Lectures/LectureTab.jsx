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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
// import {
//   useEditLectureMutation,
//   useGetLectureByIdQuery,
//   useRemoveLectureMutation,
// } from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:3000/api/media";

const LectureTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideInfo, setUploadVideoInfo] = useState(null);
  // const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lectureData, setLectureData] = useState({});

  // Params
  const params = useParams();
  const { courseId, lectureId } = params;

  // navigate
  const navigate = useNavigate();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          // get from axios
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    const myData = {
      lectureTitle,
      videoInfo: uploadVideInfo,
      isPreviewFree: isFree,
    };

    try {
      const res = await axios.post(
        `http://localhost:3000/api/course/${courseId}/lecture/${lectureId}`,
        myData,
        {
          withCredentials: true,
        }
      );
      // console.log("mtDta", myData);

      if (res) {
        // console.log("Lecture Updated", res);
        toast.success("Lecture Updated");
        navigate(-1);
      }
    } catch (error) {
      console.log("Error in editing the lecture", error);
      // toast.error()
    }
  };

  const removeLectureHandler = async () => {
    try {
      axios.delete(`http://localhost:3000/api/course/lecture/${lectureId}`, {
        withCredentials: true,
      });
      toast.success("Lecture removed");
      navigate(-1);
    } catch (error) {
      console.log("Error in removing lecture", error);
    }
  };

  const fetchLectureDetails = async () => {
    setIsLoading(true);
    try {
      const res = axios.get(
        `http://localhost:3000/api/course/lecture/${lectureId}`
      );
      const data = await res;
      // console.log("data", data);
      setLectureData(data?.data.lecture);
      setIsLoading(false);
    } catch (error) {
      console.log("Error in fetching lecture details", error);
    }
  };

  useEffect(() => {
    fetchLectureDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading)
    return (
      <>
        <div className="flex items-center justify-center w-full mt-20">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </div>
      </>
    );

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick={removeLectureHandler}>
            Remove Lecture
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureData ? lectureData.lectureTitle : lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            placeholder="Ex. Introduction to Javascript"
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={lectureData ? lectureData.isPreviewFree : isFree}
            onCheckedChange={setIsFree}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-4">
          <Button disabled={mediaProgress} onClick={editLectureHandler}>
            {mediaProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
