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
      {user.followers.length === 0 ? (
        <div className="showInMiddle">No Followers</div>
      ) : (
        user.followers.map((follower) => (
          <div className="userDetails_display-div" key={follower._id}>
            <a
              className="userDetails_display-div-link"
              href={`/user/${follower._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={follower.avatar.url} alt={follower.userName} />
              <div>{truncateText(follower.userName, 20)}</div>
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default UserFollowers;
