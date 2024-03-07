import React, { useEffect, useState } from "react";
import Post from "./Post.js";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Feed = () => {
  let [following, setFollowing] = useState(null);
  let [totalUsers, setTotalUsers] = useState(null);
  let [noOfUsers, setNoOfUsers] = useState(null);
  let [keyword, setKeyword] = useState("");
  let [allPosts, setAllPosts] = useState();

  const { userName } = useAuth();

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  useEffect(() => {
    let fetchData = async () => {
      let response = await axios.get("/api/getMe");

      if (response.data.user) {
        setAllPosts(() => {
          let posts = response.data.user.following.map((user) => {
            if (user.posts.length > 0) {
              return user.posts;
            }
            return [];
          });
          return [...posts.flat(), ...response.data.user.posts];
        });
        setFollowing(response.data.user.following);
      }

      let resp2 = await axios.get(`/api/getAllUsers?keyword=${keyword}`);
      setNoOfUsers(resp2.data.count);
      setTotalUsers(resp2.data.users);
    };

    fetchData();
  }, [keyword]);

  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <>
      {/* {allPosts ? `${allPosts.length} + yess` : "No"} */}
      {userName ? (
        <div className="feed-container">
          <div className="people-to-follow">
            <h2>
              People to Follow
              {noOfUsers !== undefined ? `(${noOfUsers} users)` : ""}
            </h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for your friend..."
                onChange={handleInputChange}
              />
            </div>

            <div className="feed_user-container">
              {totalUsers && totalUsers.length !== 0
                ? totalUsers.map((user) => (
                    <div className="user-container" key={user._id}>
                      <Link to={`/user/${user._id}`}>
                        <div className="user-container_img-div">
                          {user.avatar.url ? (
                            <img
                              className=""
                              src={user.avatar.url}
                              alt={user.userName}
                            />
                          ) : (
                            <img
                              className=""
                              src="https://res.cloudinary.com/dgfcyqq8e/image/upload/v1701364233/BuyBud/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM_e0i4jk.jpg"
                              alt={user.userName}
                            />
                          )}
                        </div>
                        <div className="user-container_username">
                          {truncateText(user.userName, 7)}
                        </div>
                      </Link>
                    </div>
                  ))
                : "Please Login."}
            </div>
          </div>

          <div className="post-container">
            {allPosts ? (
              allPosts.length > 0 ? (
                allPosts.map((post) => (
                  <div key={post._id} className="post-container_item">
                    <Post
                      likes={post.likes}
                      caption={post.caption}
                      imageArr={post.images}
                      creator={post.creator}
                      creatorId={post.creatorId}
                      postId={post._id}
                    />
                  </div>
                ))
              ) : (
                <div className="showInMiddle" key="empty-posts">
                  It's so empty. Follow some more people.
                </div>
              )
            ) : (
              <div className="showInMiddle">No posts. Follow some people.</div>
            )}
          </div>
        </div>
      ) : (
        <div>"Please Login"</div>
      )}
    </>
  );
};

export default Feed;
