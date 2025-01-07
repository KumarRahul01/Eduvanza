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
import { MdDelete } from "react-icons/md";

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

const MEDIA_API = `${import.meta.env.VITE_BACKEND_URL}api/media`;

const LectureTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lectureData, setLectureData] = useState({});
  const [videoURL, setVideoURL] = useState("");

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
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/course/${courseId}/lecture/${lectureId}`,
        myData,
        {
          withCredentials: true,
        }
      );

      if (res) {
        console.log("Lecture Updated", res);
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
      axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/course/lecture/${lectureId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Lecture removed");
      navigate(-1);
    } catch (error) {
      console.log("Error in removing lecture", error);
    }
  };

  const fetchLectureDetails = async () => {
    try {
      setIsLoading(true);
      const res = axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/course/lecture/${lectureId}`
      );
      const data = await res;
      setIsLoading(false);
      setLectureData(data?.data.lecture);
      setIsFree(data?.data.lecture.isPreviewFree);
      setVideoURL(data?.data.lecture.videoUrl);
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
    <Card className="my-8">
      <CardHeader className="flex justify-between">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Lecture</CardTitle>
            <CardDescription className="my-2">
              Make changes and click save when done.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive" onClick={removeLectureHandler}>
              <MdDelete size={"1.5rem"} />
              <span>Remove Lecture</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureData ? lectureData.lectureTitle : lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="mt-1"
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        {videoURL ? (
          <div className="my-6">
            <Label htmlFor="videoPlayer">Uploaded Video</Label>
            <video
              name="videoPlayer"
              controls
              className="w-[28rem] aspect-video object-cover mt-1 border  rounded-md text-xs"
              src={videoURL}
            />
            <div className="my-5">
              <Label>Upload New Video</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={fileChangeHandler}
                placeholder="Ex. Introduction to Javascript"
                className="w-fit"
              />
            </div>
          </div>
        ) : (
          <div className="my-5">
            <Label>
              Upload Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              accept="video/*"
              onChange={fileChangeHandler}
              placeholder="Ex. Introduction to Javascript"
              className="w-fit"
            />
          </div>
        )}
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onCheckedChange={() => setIsFree(!isFree)}
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
