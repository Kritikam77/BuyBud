const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const postController = require("../controller/postController");

const upload = require("./../utils/multer");


// Create post
router.route("/createPost").post(
  upload.fields([
    { name: "caption", maxCount: 1 },
    { name: "images", maxCount: 50 },
  ]),
  userController.authenticateUser,
  postController.createPost
);


// get post
router
  .route("/getPost/:id")
  .get(userController.authenticateUser, postController.getPostById);


// Delete own post
router
  .route("/deleteSelfPost/:id")
  .delete(userController.authenticateUser, postController.deleteSelfPost);

// Update post
router
  .route("/updatePost/:postId")
  .put(userController.authenticateUser, postController.updatePost);

// Like someone else's post
router
  .route("/likePost/:postId")
  .get(
    userController.authenticateUser,
    postController.likePost
  );

//has user liked post
router
  .route("/posts/:postId/hasLiked")
  .get(userController.authenticateUser, postController.hasUserLikedPost);

// Comment on other post
router
  .route("/commentPost/:postId")
  .post(
    userController.authenticateUser,
    postController.commentPost
  );

router
    .route('/posts/:postId/comments/:commentId')
    .delete( 
      userController.authenticateUser,
      postController.deleteOwnComment);


router
  .route("/getAllPosts")
  .get(userController.authenticateUser, postController.getAllPosts);

router
  .route("/getPost/:userId")
  .get(userController.authenticateUser, postController.getUserPosts);


//ADMIN-
router
  .route("/posts/:postId/delete")
  .delete(userController.authorizeUser, postController.deleteAnyPost);

router
  .route("/posts/:postId/comments/:commentId/delete")
  .delete(userController.authorizeUser, postController.deleteAnyComment);


module.exports = router;
