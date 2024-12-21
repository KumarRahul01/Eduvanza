/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [reloadPage, setReloadPage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState([]);

  // Function to get the value of a specific cookie
  const getCookie = (name) => {
    if (typeof document === "undefined") return null; // Ensure document.cookie is available
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  // Function to check the cookie
  const COOKIE_NAME = "uid"; // Define the cookie name
  const uid = getCookie(COOKIE_NAME);
  const checkCookie = () => {
    console.log("uid", uid);

    if (uid) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  };

  useEffect(() => {
    alert("Hlo");
    checkCookie();
  }, [uid]);

  const fetchProfileData = async () => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/user/profile`
      );
      setUserDetails(data.data.user);
    } catch (error) {
      console.error(
        "Error from frontend ContextAPI",
        error.response.data.error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        fetchProfileData,
        userDetails,
        setUserDetails,
        reloadPage,
        setReloadPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
