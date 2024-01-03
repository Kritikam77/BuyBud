const User = require("../models/userModel.js");
const Product = require("../models/productModel.js");
const DeletedUser = require("../models/deletedUserModel.js");
const {
  catchAsyncErrors,
  NewError,
} = require("./../middlewares/errorMiddleware.js");
const { generateToken } = require("./../utils/auth.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let emailValidator = require("email-validator");
const validator = require("validator");

const cloudinary = require("./../utils/cloudinary.js");
const streamifier = require("streamifier");

const crypto = require("crypto");
const nodemailer = require("nodemailer");


//process.env
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../config/config.env"),
});


exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {
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
  } = req.body;

  let avatar;

  // console.log('this ',req.files)

  //password length
  if(password.length<6){
    return res.status(400).json({
      error: "Password should be atleast 6 characters long.",
    });
  }
  //validate email
  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      error: "Please enter valid email.",
    });
  }

  //check phone number
  if (!validator.matches(phoneNumber, /^[0-9]+$/ || phoneNumber.length > 15)) {
    return res.status(400).json({
      error:
        "Invalid phone number. Must contain only numeric digits or phone number too long.",
    });
  }

  //check postal code 
  if (
    !validator.matches(postalCode, /^[0-9]+$/) ||
    postalCode.length > 15
  ) {
    return res.status(400).json({
      error:
        "Invalid postal code. Must contain only numeric digits or postal code too long.",
    });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      error: "Email already exists. Please login.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({
      message: "Password and Confirm Password should be the same.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  //upload avatar to cloudinary
  if (req.files.avatar) {
    const bufferStream = streamifier.createReadStream(
      req.files.avatar[0].buffer
    );
    const result = await new Promise((resolve, reject) => {
      const cloudStream = cloudinary.uploader.upload_stream(
        { folder: "BuyBud/users" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      bufferStream.pipe(cloudStream); // Pipe the buffer stream to the cloudinary upload stream
    });

    avatar = {
      public_id: result.public_id,
      url: result.url,
    };
  }

  if (!req.files.avatar) {
    avatar = {
      public_id:
        "https://asset.cloudinary.com/dgfcyqq8e/e1f0557f52691bcc754c2cb8a23d305f",
      url: "https://res.cloudinary.com/dgfcyqq8e/image/upload/v1701364233/BuyBud/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM_e0i4jk.jpg",
    };
  }

  user = new User({
    userName,
    email,
    password: hashedPassword,
    address: {
      houseNumber,
      street,
      city,
      state,
      postalCode,
      country,
    },
    avatar,
    phoneNumber,
    gender,
  });

  await user.save();
  let token = generateToken(user);

  res
    .status(200)
    .cookie("token", token, {
      maxAge: 864000000,
      httpOnly: true,
    })
    .json({
      message: "User saved successfully",
      user,
    });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email }).select("+password");

  if (!email || !password) {
    return res.status(403).json({
      message: "Email and password both required. Please fill all the deets.",
    });
  }
  if (!user) {
    return res
      .status(404)
      .json({ message: "User doesn't exist. Please register." });
  }

  let passwordsMatched = await user.comparePasswords(password);

  if (!passwordsMatched) {
    return res.status(404).json({
      message: "User or password is invalid. Please enter correct information.",
    });
  }

  let token = generateToken(user);

  res
    .status(200)
    .cookie("token", token, {
      maxAge: 864000000,
      httpOnly: true,
    })
    .json({
      message: "User logged in successfully",
      user,
    });
});

exports.getMe = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please login." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decoded) {
    return res.status(401).json({ message: "Please login again." });
  }
  const userId = decoded.userId;
  //   console.log(userId)
  const user = await User.findOne({ _id: userId })
    .populate(
      "products followers following posts cartItems wishlist following.posts"
    )
    .populate({
      path: "following",
      populate: {
        path: "posts",
        model: "Post",
      },
    });
  //   console.log(user)
  res.status(200).json({ user });
});

exports.authenticateUser = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please login." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decoded) {
    return res.status(401).json({ message: "Please login again." });
  }
  const userId = decoded.userId;
  const user = await User.findOne({ _id: userId });
  req.user = user;
  next();
});

exports.authorizeUser = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please login." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decoded) {
    return res.status(401).json({ message: "Please login again." });
  }
  const userId = decoded.userId;
  const user = await User.findOne({ _id: userId });
  if (user.role !== "Admin") {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this resource." });
  }
  next();
});

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  let userId = req.params.id;

  let user = await User.findOne({ _id: userId }).populate(
    "products followers following posts"
  );

  if (!user) {
    return res.status(404).json({
      message: "User doesn't exist ",
    });
  }

  return res.status(200).json({
    message: "User found successfully",
    user,
  });
});

exports.followOrUnfollowUser = catchAsyncErrors(async (req, res, next) => {
  let userToFollowId = req.params.id;

  let userLoggedInId = req.user.id;

  if (userToFollowId.toString() == userLoggedInId.toString()) {
    return res.status(400).json({ message: "User can't follow themselves." });
  }

  let userToFollow = await User.findOne({ _id: userToFollowId });
  let userLoggedIn = await User.findOne({ _id: userLoggedInId });

  if (!userToFollow) {
    return res.status(404).json({ message: "User to follow not found" });
  }

  if (!userLoggedIn) {
    return res.status(404).json({ message: "User trying to log in not found" });
  }

  let isAlreadyFollowing = userToFollow.followers.includes(userLoggedInId);
  // console.log(isAlreadyFollowing)

  //unfollow user
  if (
    userToFollowId.toString() !== userLoggedInId.toString() &&
    isAlreadyFollowing
  ) {
    await User.findByIdAndUpdate(
      { _id: userToFollowId },
      { $pull: { followers: userLoggedInId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      { _id: userLoggedInId },
      { $pull: { following: userToFollowId } },
      { new: true }
    );
    return res.status(200).json({
      message: "User unfollowed successfully.",
    });
  }

  //follow user
  if (
    userToFollowId.toString() !== userLoggedInId.toString() &&
    !isAlreadyFollowing
  ) {
    await User.findByIdAndUpdate(
      { _id: userToFollowId },
      { $addToSet: { followers: userLoggedInId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      { _id: userLoggedInId },
      { $addToSet: { following: userToFollowId } },
      { new: true }
    );

    return res.status(200).json({
      message: "User followed successfully.",
    });
  }
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user information
  user.userName = req.body.userName || user.userName;
  user.email = req.body.email || user.email;
  user.address = {
    houseNumber: req.body.houseNumber || user.address.houseNumber,
    street: req.body.street || user.address.street,
    city: req.body.city || user.address.city,
    state: req.body.state || user.address.state,
    postalCode: req.body.postalCode || user.address.postalCode,
    country: req.body.country || user.address.country,
  };
  user.avatar = req.body.avatar || user.avatar;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

  // Save the updated user
  const updatedUser = await user.save();

  return res.json({
    message: "User updated successfully",
    updatedUser,
  });
});

exports.logOut = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out." });
});

exports.deleteSelfProfile = catchAsyncErrors(async (req, res, next) => {
  let userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //store deets of the user in deletedUsers database
  let deletedUser = new DeletedUser({
    userName: user.userName,
    email: user.email,
    address: {
      houseNumber: user.address.houseNumber,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      postalCode: user.address.houseNumber,
      country: user.address.country,
    },
    phoneNumber: user.phoneNumber,
    products: user.products,
    followers: user.followers,
    followers: user.followers,
    createdAt: user.createdAt,
  });
  await deletedUser.save();

  // Remove the user's products from the Product database
  const userProducts = user.products;
  await Product.deleteMany({ _id: { $in: userProducts } });

  // Remove the user's name from other users' followers lists
  const usersFollowed = await User.find({ followers: userId });
  // console.log("this is followed by user");
  // console.log(usersFollowed);
  for (const followingUser of usersFollowed) {
    followingUser.followers.pull(userId);
    await followingUser.save();
  }

  //remove user's name from other's following
  const usersFollowing = await User.find({ following: userId });
  // console.log("this is following user");
  // console.log(usersFollowing);
  for (const followingUser of usersFollowing) {
    followingUser.following.pull(userId);
    await followingUser.save();
  }

  // Delete the user
  await user.remove();

  return res.status(200).json({ message: "User deleted by self successfully" });
});

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  let keyword = req.query.keyword || "";
  let users = await User.find({
    $or: [
      { userName: { $regex: keyword, $options: "i" } }, // Case-insensitive search for userName
      { email: { $regex: keyword, $options: "i" } }, // Case-insensitive search for email
    ],
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    message: "All users fetched",
    count: users.length,
    users,
  });
});

exports.getCart = catchAsyncErrors(async (req, res, next) => {
  let userId = req.user.id;

  const user = await User.findById(userId).populate("cartItems.product");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let cartItems = user.cartItems;
  //  console.log(user.cartItems)
  return res.status(200).json({
    message: "users cart fetched",
    cartItems,
  });
});

exports.getWishlist = catchAsyncErrors(async (req, res, next) => {
  let userId = req.user.id;

  const user = await User.findById(userId).populate("wishlist.product").exec();

  // Sort the populated wishlist based on createdAt in descending order
  user.wishlist.sort((a, b) => b.createdAt - a.createdAt);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let wishlist = user.wishlist;
  //  console.log(user.wishlist)
  return res.status(200).json({
    message: "users wishlist fetched",
    wishlist,
  });
});

exports.sameUser = catchAsyncErrors(async (req, res, next) => {
  let userId = req.user.id;

  const user = await User.findById(userId).populate("cartItems.product");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let anotherUser = req.params.id;

  if (anotherUser !== userId) {
    return res.status(200).json({
      message: "Not the same user. You can follow.",
    });
  }

  return res.status(200).json({});
});

exports.followingOrNot = catchAsyncErrors(async (req, res, next) => {
  const loggedInUserId = req.user.id;

  const otherPersonId = req.params.id;

  const loggedInUser = await User.findById(loggedInUserId);

  if (!loggedInUser) {
    return res.status(404).json({ error: "Logged-in user not found." });
  }

  const isFollowing = loggedInUser.following.includes(otherPersonId);

  // Return the result
  res.status(200).json({ following: isFollowing });
});

exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  // Find the user by ID
  const user = await User.findById(userId).select("+password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    !req.body.newPassword ||
    !req.body.confirmNewPassword ||
    !req.body.oldPassword
  ) {
    return res.status(400).json({ message: "Fill in all the details." });
  }

  // Check if the old password matches the stored hashed password
  const oldPasswordMatches = await user.comparePasswords(req.body.oldPassword);

  if (!oldPasswordMatches) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }

  //check whether new password and confirm new password matches
  if (req.body.newPassword !== req.body.confirmNewPassword) {
    return res.status(400).json({
      message: "New password and Confirm new password doesn't match.",
    });
  }
  // Update the password to the new password
  user.password = await bcrypt.hash(req.body.newPassword, 10);

  // Save the updated user with the new password
  await user.save();

  return res.json({
    message: "Password changed successfully. Redirecting to home.....",
  });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 600000; //10 minutes

  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //email content
  const mailOptions = {
    from: "BuyBud Password Recovery",
    to: email,
    subject: "BuyBud Password Reset Request",
    text: `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${req.protocol}://${req.get("host")}/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  //send the email
  await transporter.sendMail(mailOptions);

  res.json({ message: "Password reset email sent successfully" });
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmNewPassword } = req.body;

  const user = await User.findOne({
    resetPasswordExpires: { $gt: Date.now() },
    resetPasswordToken: token,
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token. Try sending email recovery email again." });
  }

  // Check if the new password and confirm password match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      message: "New password and confirm password don't match",
    });
  }

  // Update the password to the new password
  user.password = await bcrypt.hash(newPassword, 10);

  // Clear the reset token and expiration from the user document
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  // Save the updated user document
  await user.save();

  res.json({ message: "Password reset successful" });
});

exports.checkForAdmin=catchAsyncErrors(async(req,res,next)=>{
  res.json({ message: "Current user is Admin." });
  
})

//ADMIN
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate("products");

  if (!user) {
    return res.status(404).json({ error: "User doesn't exist." });
  }

  //store deets of the user in deletedUsers database
  let deletedUser = new DeletedUser({
    userName: user.userName,
    email: user.email,
    address: {
      houseNumber: user.address.houseNumber,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      postalCode: user.address.houseNumber,
      country: user.address.country,
    },
    phoneNumber: user.phoneNumber,
    products: user.products,
    followers: user.followers,
    followers: user.followers,
    createdAt: user.createdAt,
  });
  await deletedUser.save();

  // Remove the user's products from the Product database
  const userProducts = user.products;
  await Product.deleteMany({ _id: { $in: userProducts } });

  // Remove the user's name from other users' followers lists
  const usersFollowed = await User.find({ followers: userId });
  // console.log("this is followed by user");
  // console.log(usersFollowed);
  for (const followingUser of usersFollowed) {
    followingUser.followers.pull(userId);
    await followingUser.save();
  }

  //remove user's name from other's following
  const usersFollowing = await User.find({ following: userId });
  // console.log("this is following user");
  // console.log(usersFollowing);
  for (const followingUser of usersFollowing) {
    followingUser.following.pull(userId);
    await followingUser.save();
  }

  // Delete the user
  await user.deleteOne();

  return res
    .status(200)
    .json({ message: "User deleted by admin successfully" });
});
