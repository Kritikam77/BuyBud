import React from "react";
import { Link } from "react-router-dom";

const UserFollowers = ({ user }) => {
  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="userDetails_display">
      {user.following.length === 0 ? (
        <div className="showInMiddle">Not Following Anyone</div>
      ) : (
        user.following.map((following) => (
          <div className="userDetails_display-div" key={following._id}>
            <a
              className="userDetails_display-div-link"
              href={`/user/${following._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={following.avatar.url} alt={following.userName} />
              <div>{truncateText(following.userName, 20)}</div>
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default UserFollowers;
