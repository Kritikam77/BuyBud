import React from "react";
import { Link } from "react-router-dom";

const UserProducts = ({ user }) => {
  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="userDetails_display">
      {user.posts.length === 0 ? (
        <div className="showInMiddle">No Posts</div>
      ) : (
        user.posts.map((post) => (
          <div className="userDetails_display-div" key={post._id}>
            <a
              className="userDetails_display-div-link"
              href={`/posts/${post._id}/comments`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={post.images[0].url} alt={post.title} />
              <div>{truncateText(post.caption, 20)}</div>
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default UserProducts;
