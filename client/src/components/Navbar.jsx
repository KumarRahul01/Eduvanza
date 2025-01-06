import { useContext } from "react";
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
import { BookCheck, Menu, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { userDetails, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  // TODO: Make logout Handler functionality try gpt to write code to rmove cookie

  // Logout Handler
  const logoutHandler = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/user/logout`, {
        withCredentials: true,
      });
      console.log("Logout Successfully!");
      navigate("/");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error Logout Frontend", error);
    }
  };

  return (
    <>
      {/* Laptop Navbar */}
      <div className="w-full h-16 px-12 dark:bg-[#03021F] dark:text-[#FEFFFE] dark:border-b-gray-800 bg-white shadow-lg hidden md:flex items-center justify-between">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer dark:hover:text-gray-400"
          onClick={() => navigate("/")}
        >
          <h1>
            <BookCheck className="" />
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
                    <AvatarFallback>
                      <User size={24} />
                    </AvatarFallback>
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
                        isActive
                          ? "text-red-500 font-semibold w-full dark:text-red-500"
                          : "text-black w-full dark:text-slate-100"
                      }
                    >
                      My Learning
                    </NavLink>
                  </DropdownMenuItem>

                  {/* Teach On Eduvanza */}
                  {/* <DropdownMenuItem className="cursor-pointer">
                    <NavLink
                      to={"#"}
                      // className={({ isActive }) =>
                      //   isActive
                      //     ? "font-semibold w-full "
                      //     : "text-black w-full dark:text-slate-100"
                      // }
                    >
                      Teach On Eduvanza
                    </NavLink>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem className="cursor-pointer">
                    <NavLink
                      to={"/profile"}
                      className={({ isActive }) =>
                        isActive
                          ? "text-red-500 font-semibold w-full dark:text-red-500"
                          : "text-black w-full dark:text-slate-100"
                      }
                    >
                      Edit Profile
                    </NavLink>
                  </DropdownMenuItem>
                  {userDetails.role !== "Student" ? (
                    <>
                      <DropdownMenuItem
                        className="cursor-pointer w-full"
                        onClick={logoutHandler}
                      >
                        Log out
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer w-full">
                        <NavLink
                          to="/admin/dashboard"
                          className={({ isActive }) =>
                            isActive
                              ? "text-red-500 font-semibold w-full"
                              : "text-black dark:text-slate-100 w-full"
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
                        className="cursor-pointer w-full"
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
            {/* Login & SignUp Btn */}
            <div className="flex gap-2">
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/signup")}>SignUp</Button>
              <DarkMode />
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
              {isLoggedIn && (
                <>
                  <div className="hover:border-[2px] border-gray-300 p-1 rounded-md">
                    <NavLink
                      to="/admin/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "text-red-500 font-semibold w-full"
                          : "text-black dark:text-slate-100 w-full"
                      }
                    >
                      My Learning
                    </NavLink>
                  </div>
                  <div className="hover:border-[2px] border-gray-300 p-1 rounded-md">
                    <NavLink
                      to="/admin/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "text-red-500 font-semibold w-full"
                          : "text-black dark:text-slate-100 w-full"
                      }
                    >
                      Edit Profile
                    </NavLink>
                  </div>
                  <div className="hover:border-[2px] border-gray-300 p-1 rounded-md">
                    {userDetails.role !== "Student" && (
                      <NavLink
                        to={"/admin/dashboard"}
                        className={({ isActive }) =>
                          isActive
                            ? "text-red-500 font-semibold w-full"
                            : "text-black dark:text-slate-100 w-full"
                        }
                      >
                        Dashborad
                      </NavLink>
                    )}
                  </div>
                </>
              )}
              {isLoggedIn ? (
                <Button onClick={logoutHandler}>Log Out</Button>
              ) : (
                <div className="flex flex-col gap-6 my-20">
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
