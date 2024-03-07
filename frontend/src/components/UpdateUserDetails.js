import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const UpdateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: user.userName,
    houseNumber: user.address.houseNumber,
    street: user.address.street,
    city: user.address.city,
    state: user.address.state,
    postalCode: user.address.postalCode,
    country: user.address.country,
    phoneNumber: user.phoneNumber,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make your API call or update logic here using formData
      setLoading(true);
      await axios.put(`/api/updateUser`, formData);
      setLoading(false);
      // console.log(resp)
      navigate("/me");
    } catch (error) {
      // Handle error
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="updateUserDetails">
      <h2>Update User Details</h2>
      {user ? (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              House Number:
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              Street:
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              City:
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              State:
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              Postal Code:
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              Country:
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </label>
            <br />

            <button type="submit">
              {loading ? (
                <ClipLoader size={20} color={"black"} loading={loading} />
              ) : (
                "Update Details"
              )}
            </button>
          </form>
        </div>
      ) : (
        "Please Login"
      )}
    </div>
  );
};

export default UpdateUser;
