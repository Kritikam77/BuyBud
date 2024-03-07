import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ImageSlider from "./ImageSlider.js";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import axios from "axios";
import { Link } from "react-router-dom";

const Post = ({ caption, likes, imageArr, creator, creatorId, postId }) => {
  let [noOfLikes, setNoOfLikes] = useState();
  let [liked, setLiked] = useState(false);
  let [clicked, setClicked] = useState(false);
  let [saved, setSaved] = useState(false);

  //has user liked the post before
  useEffect(() => {
    let hasUserLikedPost = async () => {
      try {
        let resp = await axios.get(`/api/posts/${postId}/hasLiked`);
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

  //set number of likes
  useEffect(() => {
    setNoOfLikes(likes.length);
  }, []);

  //change color of like icon on click
  let likePost = async () => {
    try {
      setLiked(!liked);
      setClicked(true);
      await axios.get(`/api/likePost/${postId}`);
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

  //saved posts
  //has user saved the post before
  useEffect(() => {
    let hasUserSavedPost = async () => {
      try {
        let resp = await axios.get(`/api/posts/${postId}/hasSaved`);
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
      await axios.put(`/api/savePost/${postId}`);
      // console.log("clicked ", saved);
    } catch (error) {
      console.log(error);
    }
  };

  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="post">
      <div className="post-slider">
        <ImageSlider imageArr={imageArr} />
      </div>
      <div className="post-caption">
        <strong>{truncateText(caption, 30)}</strong>
      </div>
      <div className="post-likes">
        <span>
          <Link to={`/user/${creatorId}`}>{creator}</Link>
        </span>
        <span>
          <Link to="">{noOfLikes} likes</Link>
        </span>
      </div>

      <div className="post-buttons">
        <button onClick={likePost}>
          {liked ? (
            <FavoriteIcon style={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon style={{ color: "black" }} />
          )}
        </button>

        <button>
          <Link
            to={`/posts/${postId}/comments`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <ChatBubbleOutlineIcon />
          </Link>
        </button>

        <button onClick={savePost}>
          {saved ? (
            <BookmarkIcon style={{ color: "blue" }} />
          ) : (
            <BookmarkBorderIcon style={{ color: "black" }} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Post;
