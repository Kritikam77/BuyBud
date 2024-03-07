import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageSlider from "./ImageSlider";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const PostDetails = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(false);
  const { user, userName } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState();
  const [comments, setComments] = useState([]);
  const [owner, setOwner] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [displayDelete, setDisplayDelete] = useState(false);
  const [postImages, setPostImages] = useState();

  //likes
  let [noOfLikes, setNoOfLikes] = useState();
  let [liked, setLiked] = useState(false);
  let [clicked, setClicked] = useState(false);
  let [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  //fetch post details
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`/api/getPost/${id}`);
        // console.log(response.data.post.images);
        setPost(response.data.post);
        setNoOfLikes(response.data.post.likes.length);
        setPostImages(response.data.post.images);

        
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [id]);

  //update comment to whats written
  let updateComment = (e) => {
    setComment(e.target.value);
  };

  //post comment
  let commentOnPost = async () => {
    try {
      setLoading(true);
      let response = await axios.post(`/api/commentPost/${post._id}`, {
        text: comment,
      });
      // console.log(response.data.newComment);
      setLoading(false);
      setComments((prevComments) => [
        ...prevComments,
        response.data.newComment,
      ]);
      setComment("");
    } catch (error) {
      setLoading(true);
      console.log(error);
      setLoading(false);
    }
  };

  //fetch comments
  useEffect(() => {
    const fetchPostComments = async () => {
      try {
        const response = await axios.get(`/api/getPost/${id}`);
        // console.log('commms ',response.data.post.comments);
        setComments(response.data.post.comments);
      } catch (error) {
        console.error("Error fetching post Comments:", error);
      }
    };

    fetchPostComments();
  }, [id]);

  //****************************************** LIKES RELATED */
  //has user liked the post before
  useEffect(() => {
    let hasUserLikedPost = async () => {
      try {
        let resp = await axios.get(`/api/posts/${id}/hasLiked`);
        if (resp.data.hasLiked) {
          setLiked(true);
        }
        // console.log('here ',resp);
      } catch (error) {
        console.log(error);
      }
    };
    hasUserLikedPost();
  }, []);

  //change color of like icon on click
  let likePost = async () => {
    try {
      setLiked(!liked);
      setClicked(true);
      await axios.get(`/api/likePost/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  //change no of likes on click
  useEffect(() => {
    if (liked && clicked) {
      setNoOfLikes((prevValue) => {
        return prevValue + 1;
      });
    } else if (!liked && clicked) {
      setNoOfLikes((prevValue) => {
        return prevValue - 1;
      });
    }
  }, [liked]);

  //show delete post button
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        user.posts.forEach((post) => {
          if (post._id == id) {
            setOwner(true);
          }
        });
      }
    };
    fetchData();
  }, [user]);

  let deletePostFunction = async () => {
    try {
      await axios.delete(`/api/deleteSelfPost/${id}`);
      navigate("/home/feed");
    } catch (error) {
      console.log(error);
    }
  };

  //*****************************************   SAVED POST */
  //saved posts
  //has user saved the post before
  useEffect(() => {
    let hasUserSavedPost = async () => {
      try {
        let resp = await axios.get(`/api/posts/${id}/hasSaved`);
        if (resp.data.hasSaved) {
          setSaved(true);
        }
        // console.log("here ", resp);
      } catch (error) {
        console.log(error);
      }
    };
    hasUserSavedPost();
  }, []);

  //change color of save icon on click
  let savePost = async () => {
    try {
      setSaved(!saved);
      await axios.put(`/api/savePost/${id}`);
      // console.log("clicked ", saved);
    } catch (error) {
      console.log(error);
    }
  };

  //admin stuff
  const fetchAdmin = async () => {
    try {
      await axios.get("/api/admin");
      setAdmin(true);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    fetchAdmin();
  }, []);

  let deleteByAdmin = async () => {
    try {
      await axios.delete(`/api/posts/${id}/delete`);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };
  if (!post) {
    return <div>Loading...</div>;
  }

  return post ? (
    postImages ? (
      <div className="getPost">
        <div className="getPost_images">
          <ImageSlider imageArr={postImages} />
        </div>
        {owner ? (
          <button
            className="getPost_deleteButton"
            onClick={() => {
              setDeleteMsg(!deleteMsg);
            }}
          >
            Delete Post
          </button>
        ) : (
          ""
        )}
        {deleteMsg ? (
          <div className="getPost_deleteMsg">
            Are you sure you want to delete your post?{" "}
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => {
                deletePostFunction();
              }}
            >
              Yes
            </button>
          </div>
        ) : (
          ""
        )}
        <div className="getPost_caption">
          <p>{post.caption}</p>
        </div>

        <div className="getPost_goBack">
          <button onClick={() => navigate(-1)}>
            <CancelIcon />
          </button>
        </div>

        <div className="getPost_creator">
          <strong>Post By: </strong>
          <span>
            <Link to={`/user/${post.creatorId._id}`}>
              {post.creatorId.userName}
            </Link>
          </span>
        </div>

        <div className="getPost_createdAt">
          <p>{new Date(post.createdAt).toLocaleString()}</p>
        </div>

        <div className="getPost_likes">
          <button onClick={likePost}>
            {liked ? (
              <FavoriteIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderIcon style={{ color: "black" }} />
            )}
          </button>
          <span>{noOfLikes} likes</span>

          <button onClick={savePost}>
            {saved ? (
              <BookmarkIcon style={{ color: "blue" }} />
            ) : (
              <BookmarkBorderIcon style={{ color: "black" }} />
            )}
          </button>
        </div>

        <div className="getPost_comment">
          <strong>Comments:</strong>
          {comments.length === 0 ? (
            <div>No Comments</div>
          ) : (
            <div>
              {comments.map((comment, index) => (
                <div key={index}>
                  <span>
                    <Link
                      to={`/user/${comment.userId._id}`}
                      className="getPost_comment-username"
                    >
                      {comment.userId.userName} -
                    </Link>
                  </span>
                  <span>{comment.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="getPost_makeComment">
          <input type="text" value={comment} onChange={updateComment} />
          <button onClick={commentOnPost}>
            {loading ? (
              <ClipLoader size={20} color={"black"} loading={loading} />
            ) : (
              "Comment"
            )}
          </button>
        </div>

        <div className="getPost_empty">
          {" "}
          {admin ? (
            <div className="deleteAdmin">
              <button
                onClick={() => {
                  setDisplayDelete(!displayDelete);
                }}
              >
                Delete Post By Admin
              </button>
              {displayDelete ? (
                <div>
                  Do you really want to delete the post?
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
      </div>
    ) : (
      <div>Please Login.</div>
    )
  ) : (
    <div>Please Login.</div>
  );
};

export default PostDetails;

