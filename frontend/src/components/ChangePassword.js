import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";


let ChangePassword = () => {
  const navigate = useNavigate();

  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);
  let [message, setMessage] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");
      const response = await axios.put("/api/changePassword", formData);
      console.log(response.data);
      setMessage(response.data.message);
      setLoading(false);

      setTimeout(() => {
        navigate("/home");
      }, 5000);
    } catch (error) {
      setError("");
      setMessage("");
      setError(error.response.data.message);
      setLoading(false)
      console.log(error);
    }
  };

  return (
    <div className="changePassword">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Old Password:
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Confirm New Password:
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <div>
          <div className="error">{error}</div>
          <div className="message">{message}</div>
        </div>
        <button type="submit">
          {loading ? (
            <ClipLoader size={20} color={"black"} loading={loading} />
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
