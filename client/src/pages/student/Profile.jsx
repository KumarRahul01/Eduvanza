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
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import Course from "./Course";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
// Enable sending cookies with every request
axios.defaults.withCredentials = true;

const Profile = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);

  // TODO: Complete Functionalities
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    try {
      setLoading(true);
      await axios.put(
        "http://localhost:3000/api/user/profile/update",
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success("User Updated Successfully!");
      setLoading(false);
      navigate(0);
    } catch (error) {
      console.log("Error in updating user details", error.response.data.error);
    }
  };

  return (
    <div className="w-10/12 mx-auto my-10">
      <div>
        <h1 className="secFont text-xl font-bold">My profile</h1>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-normal md:gap-12 gap-2 md:w-[600px] bg-red-10 my-4">
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
              <DialogTrigger className="bg-gray-950 text-slate-100 px-4 py-1 rounded-md text-sm md:text-base">
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
                    <Label htmlFor="name">Name:</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="col-span-3 p-2 outline-none border border-[#e3e3e3] rounded-md"
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
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={loading} onClick={updateUserHandler}>
                    {loading ? (
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
      <div className="my-2">
        <h1 className="font-medium text-lg">Courses you&apos;re enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {userDetails.enrolledCourses === undefined ||
          userDetails.enrolledCourses.length === 0 ? (
            <h1>You haven&apos;t enrolled yet</h1>
          ) : (
            userDetails.enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
