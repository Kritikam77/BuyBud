import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { Route, Routes,Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";


import UserProducts from "./UserProducts.js";
import UserFollowers from "./UserFollowers.js";
import UserFollowings from "./UserFollowings.js";
import UserPosts from "./UserPosts.js";
import UserSavedPosts from "./UserSavedPosts.js";
import UserLikedPosts from "./UserLikedPosts.js";


const Me = () => {
  const { fetchUser, user, logOutUser, loading } = useAuth();
  const { isActive } = useAuth();


  useEffect(() => {
    fetchUser();
  }, []);
  return user ? (
    <div className="getMe">
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
        <div>
          <button>
            <Link className="user_button-link" to="/me/updateDetails">
              Update Details
            </Link>
          </button>
        </div>
        <div>
          <button>
            <Link className="user_button-link" to="/me/changePassword">
              Change Password
            </Link>
          </button>
        </div>
        <div>
          <button onClick={logOutUser}>
            {loading ? (
              <ClipLoader size={20} color={"black"} loading={loading} />
            ) : (
              "Log Out"
            )}
          </button>
        </div>
      </div>

      <nav className="navigation-bar getUser_navigation-bar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive(`/me/products`) ? "active-link" : ""
              }`}
              to={`/me/products`}
            >
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive(`/me/followers`) ? "active-link" : ""
              }`}
              to={`/me/followers`}
            >
              Followers
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive(`/me/followings`) ? "active-link" : ""
              }`}
              to={`/me/followings`}
            >
              Followings
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive(`/me/posts`) ? "active-link" : ""
              }`}
              to={`/me/posts`}
            >
              Posts
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive(`/me/savedPosts`) ? "active-link" : ""
              }`}
              to={`/me/savedPosts`}
            >
              Saved Posts
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                isActive(`/me/likedPosts`) ? "active-link" : ""
              }`}
              to={`/me/likedPosts`}
            >
              Liked Posts
            </Link>
          </li>
        </ul>
      </nav>

      <div className="getUser_routes">
        <Routes>
          <Route path="/products" element={<UserProducts user={user} />} />
          <Route path="/followers" element={<UserFollowers user={user} />} />
          <Route path="/followings" element={<UserFollowings user={user} />} />
          <Route path="/posts" element={<UserPosts user={user} />} />
          <Route path="/savedPosts" element={<UserSavedPosts user={user} />} />
          <Route path="/likedPosts" element={<UserLikedPosts user={user} />} />
        </Routes>
      </div>
    </div>
  ) : (
    <div>Hello, Please Wait!</div>
  );
};

export default Me;
