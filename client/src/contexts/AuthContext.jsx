/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [reloadPage, setReloadPage] = useState(false);

  // Function to get the cookie by name
  const getUID = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("uid="))
      ?.split("=")[1];
  };

  // Fetch user profile data
  const fetchProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${getUID()}`, // Pass UID in the Authorization header
          },
        }
      );
      setUserDetails(data.user);
    } catch (error) {
      console.error(
        "Error fetching user profile data",
        error.response?.data?.error || error.message
      );
      setIsLoggedIn(false); // Set to false if fetching fails
    }
  };

  // Check for UID and fetch data if user is logged in
  useEffect(() => {
    const uid = getUID();
    if (uid) {
      setIsLoggedIn(true);
      fetchProfileData();
    } else {
      setIsLoggedIn(false);
    }
  }, [reloadPage]); // Add reloadPage as a dependency to refetch when it changes

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
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
