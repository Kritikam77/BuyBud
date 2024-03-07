import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";


const Navigation = () => {
  const { isActive } = useAuth();

  return (
    <nav className="navigation-bar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link
            className={`nav-link ${
              isActive("/home/feed") ? "active-link" : ""
            }`}
            to="/home/feed"
          >
            Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${
              isActive("/home/shop") ? "active-link" : ""
            }`}
            to="/home/shop"
          >
            Shop
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
