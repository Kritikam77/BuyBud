import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await axios.put("/api/forgotPassword", { email });
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
    <div className="forgotPassword">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
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
          {loading ? "Please wait......" : "Send Password Recovery Email"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
