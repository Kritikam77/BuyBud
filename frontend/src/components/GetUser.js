import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Route, Routes } from "react-router-dom";
import { ClipLoader } from "react-spinners";


import UserProducts from "./UserProducts.js";
import UserFollowers from "./UserFollowers.js";
import UserFollowings from "./UserFollowings.js";
import UserPosts from "./UserPosts.js";

const GetUser = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState();
  const [sameUser, setSameUser] = useState();
  const [followOrUnfollowButton, setFollowOrUnfollowButton] = useState();
  const [loading, setLoading] = useState(false);
  const [displayDelete, setDisplayDelete] = useState(false);
  const { isActive } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/user/${id}/products`);
    let fetchData = async () => {
      try {
        //1.GET USER
        let response = await axios.get(`/api/getUser/${id}`);
        // console.log(response.data.user);
        setUser(response.data.user);

        //2.TO SHOW FOLLOW BUTTON
        let resp2 = await axios.get(`/api/sameUser/${id}`);
        // console.log(resp2.data.message);
        if (resp2.data.message) {
          setSameUser(resp2.data.message);
        }

        //3.TO SHOW FOLLOW OR UNFOLLOW BUTTON
        let resp3 = await axios.get(`/api/checkFollowing/${id}`);
        setFollowOrUnfollowButton(resp3.data.following);
        // console.log(resp3.data.following)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);


  //admin stuff
  const fetchAdmin = async () => {
    try {
      const response = await axios.get("/api/admin");
      setAdmin(true);
    } catch (error) {
      //   console.log(error);
    }
  };
  useEffect(() => {
    fetchAdmin();
  }, []);

  let deleteByAdmin = async () => {
    try {
      await axios.delete(`/api/deleteUser/${id}`)
      navigate('/home')
    } catch (error) {
      console.log(error)
    }
  };
  let followUnfollowUser = async () => {
    try {
      setLoading(true);
      await axios.get(`/api/followUser/${id}`);
      setLoading(false);
      setFollowOrUnfollowButton(!followOrUnfollowButton);
      // console.log(response)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {user ? (
        <div className="user_display">
          <div className="user_avatar">
            {user.avatar.url ? (
              <img className="" src={user.avatar.url} />
            ) : (
              <img
                className=""
                src={`https://res.cloudinary.com/dgfcyqq8e/image/upload/v1701364233/BuyBud/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM_e0i4jk.jpg`}
              />
            )}
          </div>
          <div className="user_details">
            <div>Name: {user.userName}</div>
            <div>Email: {user.email}</div>
            <div>Phone: {user.phoneNumber}</div>
            <div>Gender: {user.gender}</div>
          </div>
          <div className="user_address">
            Address-
            <div>House Number: {user.address.houseNumber}</div>
            <div>Street: {user.address.street}</div>
            <div>City: {user.address.city}</div>
            <div>State: {user.address.state}</div>
            <div>Postal Code: {user.address.postalCode}</div>
            <div>Country: {user.address.country}</div>
          </div>
          <div className="user_button">
            {sameUser !== undefined ? (
              <>
                {loading ? (
                  <ClipLoader size={20} color={"black"} loading={loading} />
                ) : followOrUnfollowButton ? (
                  <button
                    style={{ backgroundColor: "red" }}
                    onClick={followUnfollowUser}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button onClick={followUnfollowUser}>Follow</button>
                )}
              </>
            ) : (
              ""
            )}
          </div>

          <nav className="navigation-bar getUser_navigation-bar">
            <ul className="nav-list">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive(`/user/${user._id}/products`) ? "active-link" : ""
                  }`}
                  to={`/user/${user._id}/products`}
                >
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive(`/user/${user._id}/followers`) ? "active-link" : ""
                  }`}
                  to={`/user/${user._id}/followers`}
                >
                  Followers
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive(`/user/${user._id}/followings`)
                      ? "active-link"
                      : ""
                  }`}
                  to={`/user/${user._id}/followings`}
                >
                  Followings
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive(`/user/${user._id}/posts`) ? "active-link" : ""
                  }`}
                  to={`/user/${user._id}/posts`}
                >
                  Posts
                </Link>
              </li>
            </ul>
          </nav>

          <div className="getUser_routes">
            <Routes>
              <Route path="/products" element={<UserProducts user={user} />} />
              <Route
                path="/followers"
                element={<UserFollowers user={user} />}
              />
              <Route
                path="/followings"
                element={<UserFollowings user={user} />}
              />
              <Route path="/posts" element={<UserPosts user={user} />} />
            </Routes>
          </div>

          {admin ? (
            <div className="deleteAdmin">
              <button
                onClick={() => {
                  setDisplayDelete(!displayDelete);
                }}
              >
                Delete User By Admin
              </button>
              {displayDelete ? (
                <div>
                  Do you really want to delete the user?
                  <button
                    onClick={() => {
                      deleteByAdmin();
                    }}
                  >
                    Yes
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        "Hello,User not loaded.Please refresh."
      )}
    </>
  );
};

export default GetUser;
