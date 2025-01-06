import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Course from "./Course";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
// Enable sending cookies with every request
axios.defaults.withCredentials = true;

const Profile = () => {
  const navigate = useNavigate();

  // TODO: Complete Functionalities
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userDetails, setUserDetails] = useState({
    photoUrl: "",
    fullname: "",
    email: "",
    role: "",
  });

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    if (name.trim() !== "" && profilePhoto) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("profilePhoto", profilePhoto);
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}api/user/profile/update`,
          formData,
          {
            withCredentials: true,
          }
        );
        toast.success("User Updated Successfully!");
        setIsLoading(false);
        navigate(0);
      } catch (error) {
        console.log(
          "Error in updating user details",
          error.response.data.error
        );
      }
    } else {
      toast.error("All fields are required");
    }
  };

  const fetchProfileData = async () => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/user/profile`
      );
      const userData = data.data?.user;
      setUserDetails(userData);
      setEnrolledCourses(userData.enrolledCourses);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error from frontend ContextAPI",
        error.response.data.error
      );
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-10/12 mx-auto my-10">
        <div>
          <h1 className="text-lg font-medium">My profile</h1>
        </div>
        <MyProfileSkeleton />
        <div className="my-10 w-full">
          <h1 className="font-medium text-lg">
            Courses you&apos;re enrolled in
          </h1>
          <div className="flex gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <EnrolledCoursesSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-10/12 mx-auto my-10">
      <div>
        <h1 className="text-lg font-medium">My profile</h1>
      </div>
      <div className="border shadow-md rounded-md p-6 flex flex-row flex-wrap items-center sm:justify-normal justify-center md:gap-12 gap-6 md:w-[480px] my-4">
        <div className="md:w-40 md:h-40 w-28 h-28 overflow-hidden rounded-full">
          <Avatar>
            <AvatarImage
              src={userDetails.photoUrl || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        {/* Details */}
        <div>
          <div className="my-2">
            <span className="font-semibold">Name:</span>{" "}
            <span className="px-1">{userDetails.fullname}</span>
          </div>
          <div className="my-2">
            <span className="font-semibold">Email:</span>{" "}
            <span className="px-1">{userDetails.email}</span>
          </div>
          <div className="my-2">
            <span className="font-semibold">Role:</span>{" "}
            <span className="px-1">{userDetails.role}</span>
          </div>
          <div className="my-3">
            <Dialog>
              <DialogTrigger className="bg-gray-950 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-black text-slate-100 px-4 py-1 rounded-md text-sm font-medium md:text-base">
                Edit Profile
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-lg">Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here, click save when you are
                    done
                  </DialogDescription>
                </DialogHeader>
                {/* form */}
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name">
                      Name:<span className="text-red-500">*</span>{" "}
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="col-span-3 p-2 outline-none border border-[#e3e3e3] rounded-md"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="profilePhoto">Profile Photo:</Label>
                    <Input
                      onChange={onChangeHandler}
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={isLoading} onClick={updateUserHandler}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {/* CoursesEnrolled */}
      <div className="my-10">
        <h1 className="font-medium text-lg">Courses you&apos;re enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {enrolledCourses === undefined || enrolledCourses.length === 0 ? (
            <h1>You haven&apos;t enrolled yet</h1>
          ) : (
            enrolledCourses.map((course) => (
              <Course courseDetails={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

const MyProfileSkeleton = () => {
  return (
    <div className="border shadow-md rounded-md p-6 flex flex-row flex-wrap items-center sm:justify-normal justify-center md:gap-12 gap-6 md:w-[480px] my-4 animate-pulse">
      {/* Avatar Skeleton */}
      <div className="md:w-40 md:h-40 w-28 h-28 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"></div>

      {/* Details Skeleton */}
      <div className="flex flex-col w-full md:w-auto">
        <div className="my-2">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="my-2">
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="my-2">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="my-3">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
};

const EnrolledCoursesSkeleton = () => {
  return (
    <div className="w-72 h-80 border shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden mt-10">
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
