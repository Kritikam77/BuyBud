import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";


const CreatePost = () => {
  let [imageFiles, setImageFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const [caption, setCaption] = useState("");

  const navigate = useNavigate();

  let handleImageUpload = (e) => {
    setImageFiles(e.target.files);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  let createPost = async (e) => {
    try {
      //to get Please Wait
      setLoading(true);

      e.preventDefault();

      let formData = new FormData();
      formData.append("caption", caption);

      for (let i = 0; i < imageFiles.length; i++) {
        formData.append(`images`, imageFiles[i]);
      }

      const response = await axios.post("/api/createPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(response.data)
      setLoading(false);
      // console.log(response.data.savedPost._id);
      // navigate(`/api/getPost/${response.data.savedPost._id}`);
      navigate(`/posts/${response.data.savedPost._id}/comments`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="createPost">
      <h2>Create a Post</h2>
      <form onSubmit={createPost}>
        <div>
          <label>Images:</label>
          <input type="file" onChange={handleImageUpload} multiple required/>
        </div>
        <div>
          <label htmlFor="caption">Caption:</label>
          <textarea
            id="caption"
            value={caption}
            onChange={handleCaptionChange}
          />
        </div>
        <button type="submit">
          {loading ? (
            <ClipLoader size={20} color={"black"} loading={loading} />
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
