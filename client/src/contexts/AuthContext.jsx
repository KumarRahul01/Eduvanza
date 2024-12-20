/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [cookieChecked, setCookieChecked] = useState(false); // Tracks if the cookie check is complete

  // Function to get the value of a specific cookie
  const getCookie = (name) => {
    if (typeof document === "undefined") return null; // Ensure document.cookie is available
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  // Function to check the cookie with a polling mechanism
  const checkCookie = async () => {
    const COOKIE_NAME = "uid";
    let attempts = 0; // To limit polling attempts

    const pollCookie = () => {
      const uid = getCookie(COOKIE_NAME);
      console.log("Polling for UID:", uid);
      if (uid) {
        setIsLoggedIn(true);
        setCookieChecked(true); // Mark cookie check as complete
      } else if (attempts < 10) {
        // Retry up to 10 times (adjust as needed)
        attempts++;
        setTimeout(pollCookie, 500); // Check every 500ms
      } else {
        setIsLoggedIn(false); // If the cookie is still not available
        setCookieChecked(true); // Mark cookie check as complete
      }
    };

    pollCookie();
  };

  useEffect(() => {
    checkCookie();
  }, []);

  // Function to fetch user profile data
  const fetchProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/user/profile`
      );
      setUserDetails(data.user);
    } catch (error) {
      console.error(
        "Error fetching profile data:",
        error.response?.data?.error || error.message
      );
    }
  };

  if (!cookieChecked) {
    // Optionally, show a loading state while waiting for the cookie
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        fetchProfileData,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
