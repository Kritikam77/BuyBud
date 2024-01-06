const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const userController = require("../controller/userController");

const upload = require("./../utils/multer");

// Create a new product
router.route("/createProduct").post(
  upload.fields([
    { name: "title", maxCount: 1 },
    { name: "description", maxCount: 1 },
    { name: "price", maxCount: 1 },
    { name: "category", maxCount: 1 },
    { name: "stock", maxCount: 1 },
    { name: "imageUrls", maxCount: 30 },
  ]),
  userController.authenticateUser,
  productController.createProduct
);

router.route("/getAllProducts").get(productController.getAllProducts);

router.route("/getProduct/:id").get(productController.getProductById);

router
  .route("/updateOwnProduct/:id")
  .put(userController.authenticateUser, productController.updateOwnProduct);

router
  .route("/deleteOwnProduct/:id")
  .delete(userController.authenticateUser, productController.deleteOwnProduct);

router
  .route("/addProductToCart/:id")
  .put(userController.authenticateUser, productController.addProductToCart);

router
  .route("/removeProductFromCart/:id")
  .delete(
    userController.authenticateUser,
    productController.removeProductFromCart
  );

router
  .route("/decreaseProductQuantity/:id")
  .put(
    userController.authenticateUser,
    productController.decreaseProductQuantity
  );

router
  .route("/addProductToWishlist/:id")
  .put(
    userController.authenticateUser,
    productController.addOrRemoveProductToWishlist
  );

//ADMIN
router
  .route("/deleteProduct/:id")
  .delete(userController.authorizeUser, productController.deleteProduct);

module.exports = router;
