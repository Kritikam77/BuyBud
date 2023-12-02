const Post = require("../models/postModel.js"); 
const User = require("../models/userModel.js"); 
const {
  catchAsyncErrors,
  NewError,
} = require("./../middlewares/errorMiddleware.js");


const cloudinary = require("./../utils/cloudinary.js");
const streamifier = require("streamifier");


const createPost = catchAsyncErrors(async (req, res) => {
  const { caption } = req.body;
  let images = [];
  let userId = req.user.id;

  //upload to cloudinary
  for (let i = 0; i < req.files.images.length; i++) {
    const bufferStream = streamifier.createReadStream(
      req.files.images[i].buffer
    ); // Create a readable stream from the buffer

    const result = await new Promise((resolve, reject) => {
      const cloudStream = cloudinary.uploader.upload_stream(
        { folder: "BuyBud/posts" },
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

    images.push({
      public_id: result.public_id,
      url: result.url,
    });
  }

  const newPost = new Post({
    images,
    caption,
    creatorId: userId,
  });

  const savedPost = await newPost.save();

  //to add the productId to user's database after he/she creates a product.
  let postId = savedPost._id;
  console.log(postId);
  await User.findByIdAndUpdate(
    { _id: userId },
    { $addToSet: { posts: postId } },
    { new: true }
  );

  res.status(201).json({
    message: "Post created successfully",
    savedPost,
  });
});

const getPostById = catchAsyncErrors(async (req, res) => {
  let id=req.params.id

  let post=await Post.findOne({_id:id}).populate("creatorId comments.userId")

  if(!post){
    res.status(400).json({
      message: "No such post found.",
    });
  }

  res.status(201).json({
    message: "Post fetched successfully",
    post,
  });
});
const deleteSelfPost = catchAsyncErrors(async (req, res) => {
  let postId = req.params.id;

  let userId = req.user._id;

  let post = await Post.findOne({ _id: postId });

  if (!post) {
    return res.status(400).json({
      message: "post doesn't exist.",
    });
  }

  if (post.creatorId.toString() == userId.toString()) {
    //delete post from user's database
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { posts: postId } },
      { new: true }
    );

    //delete post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "post deleted successfully." });
  }
  if (post.creatorId !== userId) {
    return res
      .status(404)
      .json({ message: "You are not authorized to access this resource." });
  }
});

const updatePost = catchAsyncErrors(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const { caption } = req.body;

  const post = await Post.findOne({ _id: postId, creatorId: userId });

  if (!post) {
    return res
      .status(404)
      .json({ message: "Post not found or unauthorized to update." });
  }

  // post.images = images;
  post.caption = caption;

  const updatedPost = await post.save();

  res.status(200).json({
    message: "Post updated successfully.",
    updatedPost,
  });
});

const likePost = catchAsyncErrors(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const post = await Post.findById(postId);
  const user = await User.findById(userId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Check if the user has already liked the post
  const hasLiked = post.likes.includes(userId);

  // Toggle like status
  if (hasLiked) {
    // Remove like
    post.likes.pull(userId);
    user.likedPosts.pull(postId);
    await post.save();
    await user.save();
    return res
      .status(200)
      .json({ message: "Post unliked successfully." });
  } else {
    // Add like
    post.likes.push(userId);
    user.likedPosts.push(postId);
    await post.save();
    await user.save();
    return res
      .status(200)
      .json({ message: "Post liked successfully." });
  }

  
});

const hasUserLikedPost = catchAsyncErrors(async (req, res, next) => {
  const postId = req.params.postId; 
  const userId = req.user.id; 

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const hasLiked = post.likes.includes(userId);

  res.status(200).json({ hasLiked });
});

const commentPost = catchAsyncErrors(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; 
  const { text } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  const newComment = {
    userId,
    text,
  };

  post.comments.push(newComment);
  const updatedPost = await post.save();

  res.status(200).json({
    "message":"Comment on post successful.",
    newComment,
    updatedPost});
});

const deleteOwnComment = catchAsyncErrors(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Find the index of the comment in the post's comments array
  const commentIndex = post.comments.findIndex(
    (comment) =>
      comment._id.toString() === commentId &&
      comment.userId.toString() === userId
  );

  // Check if the comment was found
  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comment not found." });
  }

  // Remove the comment
  post.comments.splice(commentIndex, 1);

  const updatedPost = await post.save();

  res.status(200).json(updatedPost);
});


// Get all posts sorted by likes (descending order)
const getAllPosts = catchAsyncErrors(async (req, res) => {
  const posts = await Post.find()
    .sort({ likes: -1 }) // Sort by likes in descending order
    .populate('creatorId', 'userName'); // Adjust fields as needed

  res.status(200).json({
    count:posts.length,
    posts});
});


// Get posts of a specific user
const getUserPosts = catchAsyncErrors(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const userPosts = await Post.find({ creatorId: userId }).populate('creatorId', 'userName'); // Adjust fields as needed

  res.status(200).json({
    count: userPosts.length,
    userPosts,
  });
});


//ADMIN

// Function to delete any post
const deleteAnyPost = catchAsyncErrors(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Find the creator's user ID
  const creatorId = post.creatorId;

  // Delete the post
  await post.remove();

  // Remove the post ID from the creator's posts array
  await User.findByIdAndUpdate(
    { _id: creatorId },
    { $pull: { posts: postId } },
    { new: true }
  );

  res.status(200).json({ message: "Post deleted successfully by admin." });
});


// Function to delete any comment
const deleteAnyComment = catchAsyncErrors(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Find the index of the comment in the post's comments array
  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );

  // Check if the comment was found
  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comment not found." });
  }

  // Remove the comment
  post.comments.splice(commentIndex, 1);

  await post.save();

  res.status(200).json({ message: "Comment deleted successfully by admin." });
});


module.exports = {
  createPost,
  getPostById,
  deleteSelfPost,
  updatePost,
  likePost,
  hasUserLikedPost,
  commentPost,
  deleteOwnComment,
  deleteAnyPost,
  deleteAnyComment,
  getAllPosts,
  getUserPosts
};
