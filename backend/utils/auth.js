const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



// Function to generate a JWT token
function generateToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}


// // Function to compare a plain text password with a hashed password
// async function comparePasswords(plainPassword, hashedPassword) {
//   return await bcrypt.compare(plainPassword, hashedPassword);
// }


module.exports = { generateToken};
