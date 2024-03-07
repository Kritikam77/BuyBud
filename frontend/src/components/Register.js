import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { ClipLoader } from "react-spinners";



const Register = () => {
  const {
    registerUser,
    errorDisplay,
    messageDisplay,
    loading,
    setErrorDisplay,
    setMessageDisplay,
  } = useAuth();


  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [houseNumber, setHouseNumber] = useState(null);
  const [street, setStreet] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [country, setCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [gender, setGender] = useState(null);
  const [avatar, setAvatar] = useState(null);


  const countryOptions = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Côte d'Ivoire",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo (Congo-Kinshasa)",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (formerly Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia (formerly Macedonia)",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const handleAvatarUpload = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    try {
      //to get Please Wait

      e.preventDefault();

      await registerUser({
        userName,
        email,
        password,
        confirmPassword,
        houseNumber,
        street,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
        gender,
        avatar,
      });
    } catch (error) {
      console.log("error in handleRegister in Register.js ", error.response.data);
    }
  };

  useEffect(()=>{
    setErrorDisplay("")
    setMessageDisplay("")
  },[])
  
  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="register_first">
          <div className="form-group">
            <label>Avatar:</label>
            <input type="file" onChange={handleAvatarUpload} />
          </div>
        </div>
        <div className="register_second">
          <div className="form-group">
            <label htmlFor="userName" required>
              Username:
            </label>
            <input
              type="text"
              id="userName"
              placeholder="Enter your username"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
              }}
              required
            >
              <option value="" disabled selected>
                Select your gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="register_third">
          <div className="form-group">
            <label htmlFor="houseNumber">House Number:</label>
            <input
              type="text"
              id="houseNumber"
              placeholder="Enter your house number"
              value={houseNumber}
              onChange={(e) => {
                setHouseNumber(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="street">Street:</label>
            <input
              type="text"
              id="street"
              placeholder="Enter your street"
              value={street}
              onChange={(e) => {
                setStreet(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              placeholder="Enter your state"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code:</label>
            <input
              type="text"
              id="postalCode"
              placeholder="Enter your postal code"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
              required
            >
              <option value="" disabled selected>
                Select your country
              </option>
              {countryOptions.map((countryOption, index) => (
                <option key={index} value={countryOption}>
                  {countryOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group register_button">
          <div className="error">{errorDisplay}</div>
          <div className="message">{messageDisplay}</div>
          <button type="submit">
            {loading ? (
              <ClipLoader size={20} color={"black"} loading={loading} />
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
