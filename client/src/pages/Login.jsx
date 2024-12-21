import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { setReloadPage } = useContext(AuthContext);

  const [currentTab, setCurrentTab] = useState("signup");

  //* Login & SignUp Functionality Starts
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [signUpInput, setSignUpInput] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const ChangeInputHandler = (e, type) => {
    if (type === "login") {
      setLoginInput((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      setSignUpInput((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const signUpLogic = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/user/signup`,
        signUpInput,
        {
          withCredentials: true,
        }
      );
      console.log(signUpInput);
      setErrorMsg("");
      toast.success("SignUp Successfully!");
    } catch (error) {
      toast.error("SignUp Failed!");
      setErrorMsg(error.response?.data?.error || "SignUp Error");
    } finally {
      setIsLoading(false);
      setSignUpInput({
        fullname: "",
        username: "",
        email: "",
        password: "",
      });
    }
  };

  const loginLogic = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/user/login`,
        // `http://localhost:3000/api/user/login`,
        loginInput,
        {
          withCredentials: true,
        }
      );
      setErrorMsg("");
      toast.success("Login successfully!");
      navigate("/");
      // setReloadPage(true);
      setIsLoading(false);
    } catch (error) {
      toast.error("Login Failed!");
      setErrorMsg(error.response?.data?.error || "Login Error");
    } finally {
      setLoginInput((prev) => ({
        email: prev.email,
        password: "",
      }));
    }
  };

  const handlerRegisteration = async (type) => {
    // const inputData = type === "signup" ? signUpInput : loginInput;
    // const action = type === "signup" ? signUpUser : loginUser;
    // await action(inputData);
    if (type === "signup") signUpLogic();
    if (type === "login") loginLogic();
  };

  useEffect(() => {
    // Update the tab based on URL path
    const urlPath = window.location.pathname;
    setCurrentTab(urlPath === "/login" ? "login" : "signup");
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-[90vh] mt-10 md:mt-0">
      <Tabs
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value)} // Keep state synced
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* Sign Up Content */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <div className="w-full flex items-center justify-center pb-2">
                <Button>Sign Up With Google</Button>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full border h-[2px]"></div>
                <div className="w-4 mx-4 font-semibold">OR</div>
                <div className="w-full border h-[2px]"></div>
              </div>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account and click signup when you are done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="fullname">
                  Full Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="John Doe"
                  value={signUpInput.fullname}
                  onChange={(e) => ChangeInputHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">
                  Username<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe01"
                  value={signUpInput.username}
                  onChange={(e) => ChangeInputHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Johndoe@gmail.com"
                  value={signUpInput.email}
                  onChange={(e) => ChangeInputHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">
                  Password<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="qwerty"
                  value={signUpInput.password}
                  onChange={(e) => ChangeInputHandler(e, "signup")}
                  required
                />
              </div>
              <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-col gap-2 justify-center">
                <Button
                  disabled={isLoading}
                  onClick={() => handlerRegisteration("signup")}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      Wait!
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                <p className="text-xs">
                  Already have an account{" "}
                  <span
                    className="text-blue-500 hover:underline underline-offset-2 font-medium cursor-pointer"
                    onClick={() => setCurrentTab("login")}
                  >
                    Login Here
                  </span>{" "}
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Login Content */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <div className="w-full flex items-center justify-center pb-2">
                <Button>Login With Google</Button>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full border h-[2px]"></div>
                <div className="w-4 mx-4 font-semibold">OR</div>
                <div className="w-full border h-[2px]"></div>
              </div>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you will be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Johndoe@gmail.com"
                  value={loginInput.email}
                  onChange={(e) => ChangeInputHandler(e, "login")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">
                  Password<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="qwerty"
                  value={loginInput.password}
                  onChange={(e) => ChangeInputHandler(e, "login")}
                  required
                />
              </div>
              <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-col gap-2 justify-center">
                <Button
                  disabled={isLoading}
                  onClick={() => handlerRegisteration("login")}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      Wait!
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <p className="text-xs">
                  Don&apos;t have an account{" "}
                  <span
                    className="text-blue-500 hover:underline underline-offset-2 font-medium cursor-pointer"
                    onClick={() => setCurrentTab("signup")}
                  >
                    SignUp Here
                  </span>{" "}
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
