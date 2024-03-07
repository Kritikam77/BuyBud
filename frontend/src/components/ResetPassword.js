import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


const ResetPassword = ({ match }) => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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

    const { newPassword, confirmNewPassword } = formData;

    try {
        setLoading(true);
        setError("");
        setMessage("");

      const response = await axios.put(`/api/reset-password/${token}`, {
        newPassword,
        confirmNewPassword,
      });
      setMessage(response.data.message);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(true);
      setMessage("");
      setError("");
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="resetPassword">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
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
          {loading ? "Please wait......" : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
