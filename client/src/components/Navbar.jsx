import { useContext, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DarkMode from "./DarkMode";

// Sheet
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BookCheck, Menu } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { fetchProfileData, userDetails, isLoggedIn, reloadPage } =
    useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      fetchProfileData();
    }
  }, [isLoggedIn, fetchProfileData]);

  // Logout Login
  const logoutHandler = async () => {
    try {
      await axios.get("http://localhost:3000/api/user/logout");
      console.log("Logout Successfully!");
      navigate(0);
    } catch (error) {
      console.log("Error Logout Frontend", error);
    }
  };

  useEffect(() => {
    if (reloadPage) {
      navigate(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPage]);

  return (
    <>
      {/* Laptop Navbar */}
      <div className="w-full h-16 px-12 dark:bg-[#03021F] dark:text-[#FEFFFE] dark:border-b-gray-800 bg-white shadow-lg hidden md:flex items-center justify-between">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1>
            <BookCheck />
          </h1>
          <h1 className="font-bold text-3xl">Eduvanza</h1>
        </div>
        {/* Navigation Links */}
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44">
                  <DropdownMenuLabel className="text-center line-clamp-1">
                    {userDetails.fullname}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <NavLink
                      to="/my-learning"
                      className={({ isActive }) =>
                        isActive ? "text-red-500 font-semibold" : "text-black"
                      }
                    >
                      My Learning
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Teach On Eduvanza
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link to={"/profile"}>Edit Profile</Link>
                  </DropdownMenuItem>
                  {userDetails.role !== "Student" ? (
                    <>
                      <DropdownMenuItem className="cursor-pointer">
                        Log out
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <NavLink
                          to="/admin"
                          className={({ isActive }) =>
                            isActive
                              ? "text-red-500 font-semibold"
                              : "text-black"
                          }
                        >
                          Dashborad
                        </NavLink>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={logoutHandler}
                      >
                        Log Out
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <div>
                <DarkMode />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative group">
              <Button to={"#"} className="">
                Teach on Eduvanza
              </Button>
              <div className="hidden group-hover:block absolute top-14 left-0 p-4 w-[320px] h-40 border border-gray-300 shadow-lg bg-white">
                <p className="font-bold text-xl">
                  Turn your knowledge into an opportunity and reach millions of
                  users
                </p>
                <Button className="w-full my-2">Learn More</Button>
              </div>
            </div>

            {/* Login & SignUp Btn */}
            <div className="flex gap-2">
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/signup")}>SignUp</Button>
            </div>
          </>
        )}
      </div>
      {/* Mobile Navbar */}
      <div className="w-full h-16 px-5 dark:bg-[#03021F] dark:text-[#FEFFFE] dark:border-b-gray-800 bg-white shadow-lg flex md:hidden items-center justify-between">
        <h1 className="font-bold text-2xl">
          <Link to={"/"}>Eduvanza</Link>
        </h1>
        <MobileNavbar />
      </div>
    </>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userDetails, logoutHandler } = useContext(AuthContext);

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Menu size={"1.5rem"} />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <div
              className="flex items-center justify-between mt-8"
              onClick={() => navigate("/")}
            >
              <SheetTitle className="text-xl cursor-pointer">
                Eduvanza
              </SheetTitle>
              <DarkMode />
            </div>
            <SheetDescription></SheetDescription>
            <div className="flex flex-col gap-6">
              <div className="hover:border-[2px] border-gray-300 p-1 rounded-md">
                <Link to={"/my-learning"}>My Learning</Link>
              </div>
              <div className="hover:border-[2px] border-gray-300 p-1 rounded-md">
                <Link to={"/profile"}>Edit Profile</Link>
              </div>
              {isLoggedIn ? (
                <div className="hover:border-[2px] border-gray-300 p-1 rounded-md">
                  {userDetails.role !== "student" ? "Dashboard" : ""}
                </div>
              ) : (
                ""
              )}
              {isLoggedIn ? (
                <Button onClick={logoutHandler}>Log Out</Button>
              ) : (
                <div className="flex flex-col gap-6">
                  <Button onClick={() => navigate("/signup")}>SignUp</Button>
                  <Button onClick={() => navigate("/login")}>Login</Button>
                </div>
              )}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};
