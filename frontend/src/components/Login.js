import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const { login, errorDisplay, messageDisplay, loading } = useAuth();

  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const data = {
        email,
        password,
      };

      await login(data);
    } catch (error) {
      console.log("error in handleLogin in Login.js ", error.response.data);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>
        <div>
          <div className="error">{errorDisplay}</div>
          <div className="message">{messageDisplay}</div>
        </div>
        <div className="form-group">
          {/* <button type="submit">{loading ? "Please Wait...." : "Login"}</button> */}
          <button type="submit">
            {loading ? (
              <ClipLoader size={20} color={"black"} loading={loading} />
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="form-group login-links">
          <div>
            <Link to="/register">New User ? Register</Link> <br />
          </div>
          <div>
            <Link to="/forgotPassword">Forgot Password</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
