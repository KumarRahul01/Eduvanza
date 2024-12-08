import { AuthContext } from "@/contexts/AuthContext";
import { use } from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export const AuthenticatedUser = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return children;
};

export const AdminRoutes = ({ children }) => {
  const { isLoggedIn, userDetails } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  if (userDetails.role !== "Instructor") {
    return <Navigate to={"/"} />;
  }

  return children;
};
