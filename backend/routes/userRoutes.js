const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

const upload = require("./../utils/multer");


// Register user
router.route("/registerUser").post(
  upload.fields([
    { name: "userName", maxCount: 1 },
    { name: "email", maxCount: 1 },
    { name: "password", maxCount: 1 },
    { name: "confirmPassword", maxCount: 1 },
    { name: "houseNumber", maxCount: 1 },
    { name: "street", maxCount: 1 },
    { name: "city", maxCount: 1 },
    { name: "state", maxCount: 1 },
    { name: "postalCode", maxCount: 1 },
    { name: "country", maxCount: 1 },
    { name: "phoneNumber", maxCount: 1 },
    { name: "gender", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  userController.registerUser
);

router
    .route("/loginUser")
    .post(userController.loginUser);

router
    .route('/getMe')
    .get(userController.getMe)

router
    .route('/getUser/:id')
    .get(userController.getUser)

router
  .route("/followUser/:id")
  .get(userController.authenticateUser, userController.followOrUnfollowUser);

router
  .route("/updateUser")
  .put(userController.authenticateUser, userController.updateUser);

router
  .route("/changePassword")
  .put(userController.authenticateUser, userController.changePassword);

router
  .route("/logout")
  .get(userController.authenticateUser, userController.logOut);

router
  .route("/deleteSelf")
  .delete(userController.authenticateUser, userController.deleteSelfProfile);

router
  .route("/getAllUSers")
  .get(userController.authenticateUser, userController.getAllUsers);

router
  .route("/getCart")
  .get(userController.authenticateUser, userController.getCart);

router
  .route("/getWishlist")
  .get(userController.authenticateUser, userController.getWishlist);

router
  .route("/sameUser/:id")
  .get(userController.authenticateUser, userController.sameUser);

router
  .route("/checkFollowing/:id")
  .get(userController.authenticateUser, userController.followingOrNot);



//ADMIN
router
  .route("/deleteUser/:id")
  .delete(userController.authorizeUser, userController.deleteUser);


module.exports = router;
