import axios from "axios";
import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [reloadPage, setReloadPage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState([]);

  // Check if user is login or not by checking cookie
  // useEffect(() => {
  //   // Function to get the value of a specific cookie
  //   function getCookie(name) {
  //     const value = `; ${document.cookie}`; // Use template literals for the value
  //     const parts = value.split(`; ${name}=`); // Correct the template literal here as well
  //     if (parts.length === 2) return parts.pop().split(";").shift(); // Return cookie value if found
  //     return null; // Return null if cookie is not found
  //   }

  //   // Example usage to get 'uid' cookie
  //   const uid = getCookie("uid");
  //   console.log("uid", uid);

  //   if (uid) {
  //     // console.log("User is already logged in");
  //     setIsLoggedIn(true); // Set logged in state to true
  //   } else {
  //     // console.log("User is not logged in");
  //     setIsLoggedIn(false); // Set logged in state to false
  //   }
  // }, []);

  useEffect(() => {
    // Function to get the value of a specific cookie
    const getCookie = (name) => {
      if (typeof document === "undefined") return null; // Ensure document.cookie is available
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      return parts.length === 2 ? parts.pop().split(";").shift() : null;
    };

    const COOKIE_NAME = "uid"; // Define the cookie name
    const uid = getCookie(COOKIE_NAME);
    console.log("uid", uid);

    if (uid) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

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
