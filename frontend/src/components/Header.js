import React from "react";
import logo from "./../images/logo-w.png";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

//icons
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const Header = () => {
  const { userName, isActive } = useAuth();

  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        {userName ? (
          <Link to="/home">
            <img src={logo} alt="My Image" />
          </Link>
        ) : (
          <img src={logo} alt="My Image" />
        )}
      </div>

      <div className="header_navigation-container">
        <ul className="header_nav-list">
          <li className="header_nav-item">
            {userName ? (
              <Link
                className={`${
                  isActive("/home/feed") || isActive("/home/shop")
                    ? "active-link"
                    : ""
                }`}
                to="/home"
              >
                Home
              </Link>
            ) : (
              // <ArrowRightAltIcon />
              ""
            )}
          </li>
          <li className="header_nav-item">
            {userName ? (
              <Link
                className={`${isActive("/sellProduct") ? "active-link" : ""}`}
                to="/sellProduct"
              >
                Sell Product
              </Link>
            ) : (
              // <ArrowRightAltIcon />
              ""
            )}
          </li>
          <li className="header_nav-item">
            {userName ? (
              <Link
                className={`${isActive("/createPost") ? "active-link" : ""}`}
                to="/createPost"
              >
                Create Post
              </Link>
            ) : (
              // <ArrowRightAltIcon />
              ""
            )}
          </li>
          <li className="header_nav-item">
            {userName ? (
              <Link
                className={`${isActive("/findFriends") ? "active-link" : ""}`}
                to="/findFriends"
              >
                Find Friends
              </Link>
            ) : (
              // <ArrowRightAltIcon />
              ""
            )}
          </li>
          <li className="header_nav-item">
            {userName ? (
              <Link
                className={`${isActive("/me") ? "active-link" : ""}`}
                to="/me"
              >
                {truncateText(userName, 10)}
              </Link>
            ) : (
              <Link
                className={`${isActive("/login") ? "active-link" : ""}`}
                to="/login"
              >
                Login/Register
              </Link>
            )}
          </li>
          {/* <li className="header_nav-item">
            <Link
              className={`${isActive("/notifications") ? "active-link" : ""}`}
              to="/notifications"
              aria-label="Notification icon"
              role="img"
            >
              <NotificationsIcon />
            </Link>
          </li> */}
          <li className="header_nav-item">
            {userName ? (
              <Link
                className={`${isActive("/wishlist") ? "active-link" : ""}`}
                to="/wishlist"
              >
                <FavoriteIcon style={{ color: "red" }} />
              </Link>
            ) : (
              // <KeyboardBackspaceIcon />
              ""
            )}
          </li>
          <li className="header_nav-item">
            {userName ? (
              <Link
                className={`${isActive("/cart") ? "active-link" : ""}`}
                to="/cart"
              >
                <ShoppingCartIcon />
              </Link>
            ) : (
              // <KeyboardBackspaceIcon />
              ""
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
