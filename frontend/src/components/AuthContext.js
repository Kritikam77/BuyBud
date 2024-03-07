import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [errorDisplay, setErrorDisplay] = useState(null);
  const [messageDisplay, setMessageDisplay] = useState(null);
  const [loading, setLoading] = useState(false);

  //function to decide active link
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path);

  //getUser
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/getMe");
      setUser(response.data.user);
      setUserName(response.data.user.userName);
      // console.log("ynha se ",response);
    } catch (error) {
      // console.log("error in fetchUser in AuthContext.js", error);
      navigate("/login");
      setUserName(null);

      // return error;
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  //login
  const login = async (data) => {
    try {
      setLoading(true);
      setErrorDisplay("");
      setMessageDisplay("");

      let response = await axios.post("/api/loginUser", data);
      setErrorDisplay(null);
      setMessageDisplay(response.data.message);
      setLoading(false);

      //change userName
      fetchUser();
      // console.log('working')
      navigate("/home");

      //   return response.data;
    } catch (error) {
      //   console.log("error in login in AuthContext ", error);
      setMessageDisplay(null);
      setErrorDisplay(error.response.data.message);
      setLoading(false);
    }
  };

  let logOutUser = async () => {
    try {
      setLoading(true);
      setErrorDisplay("");
      setMessageDisplay("");
      await axios.get(`/api/logout`);
      //   console.log(response.data);
      setLoading(false);

      setUser(null);
      setUserName(null);
      navigate(`/login`);
    } catch (error) {
      console.log(error);
    }
  };

  let registerUser = async ({
    userName,
    email,
    password,
    confirmPassword,
    houseNumber,
    street,
    city,
    state,
    postalCode,
    country,
    phoneNumber,
    gender,
    avatar,
  }) => {
    try {
      //to get Please Wait
      setLoading(true);
      setErrorDisplay("");
      setMessageDisplay("");

      // e.preventDefault();

      //append form data
      let formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("houseNumber", houseNumber);
      formData.append("street", street);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("postalCode", postalCode);
      formData.append("country", country);
      formData.append("phoneNumber", phoneNumber);
      formData.append("gender", gender);

      formData.append(`avatar`, avatar);

      // console.log("in front ", avatar);
      const response = await axios.post("/api/registerUser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setErrorDisplay(null);
      setMessageDisplay(response.data.message);
      setLoading(false);
      // console.log(response)

      //change userName
      fetchUser();
      navigate("/home");
    } catch (error) {
      setMessageDisplay(null);
      setErrorDisplay(error.response.data.error);
      console.log(error.response.data);
      setLoading(false);
      // console.log(error.response.data)
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userName,
        errorDisplay,
        messageDisplay,
        loading,
        fetchUser,
        login,
        logOutUser,
        registerUser,
        isActive,
        setErrorDisplay,
        setMessageDisplay
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
