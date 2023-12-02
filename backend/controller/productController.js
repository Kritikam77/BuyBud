const Product = require("../models/productModel.js");
const User = require("../models/userModel.js");
const {
  catchAsyncErrors,
  NewError,
} = require("./../middlewares/errorMiddleware.js");

const cloudinary = require("./../utils/cloudinary.js");
const streamifier = require("streamifier");

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let userId = req.user.id;
  let imageUrls = [];
  // console.log("files ", req.files);
  // console.log("body ", req.body);
  const { title, description, price, category, stock } = req.body;

  for (let i = 0; i < req.files.imageUrls.length; i++) {
    const bufferStream = streamifier.createReadStream(
      req.files.imageUrls[i].buffer
    ); // Create a readable stream from the buffer

    const result = await new Promise((resolve, reject) => {
      const cloudStream = cloudinary.uploader.upload_stream(
        { folder: "BuyBud/products" },
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

    imageUrls.push({
      public_id: result.public_id,
      url: result.url,
    });
  }

  // Create a new product instance
  const newProduct = new Product({
    title,
    description,
    price,
    category,
    stock,
    imageUrls,
    owner: userId,
  });

  // Save the product to the database
  await newProduct.save();

  //to add the productId to user's database after he/she creates a product.
  let productId = newProduct._id;
  await User.findByIdAndUpdate(
    { _id: userId },
    { $addToSet: { products: productId } },
    { new: true }
  );

  res.status(201).json({ message: "Product created successfully", newProduct });
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  let keyword = req.query.keyword || "";
  let categories = req.query.categories || [];
  let isSort = req.query.sort;
  let minPrice = req.query.minPrice;
  let maxPrice = req.query.maxPrice;

  if (parseFloat(minPrice) > parseFloat(maxPrice)) {
    return res.status(400).json({
      message: "Minimum Price can't be greater than Maximum Price.",
    });
  }
  // Check if categories are provided in the URL
  let categoryFilter = {};
  if (categories.length > 0) {
    categoryFilter = { category: { $in: categories } };
  }
  // console.log(...categories)

  // Check whether to sort low to high or the other way
  let isSortLow = isSort ? isSort : 0;
  console.log(isSortLow);
  let products = await Product.find({
    title: { $regex: keyword, $options: "i" },
    ...categoryFilter,
    price: {
      $gte: minPrice ? minPrice : 0,
      $lte: maxPrice ? maxPrice : 100000000,
    },
  }).sort(isSortLow !== 0 ? { price: isSortLow } : undefined);

  let count = products.length;
  return res.status(200).json({
    count,
    products,
  });
});

exports.getProductById = catchAsyncErrors(async (req, res, next) => {
  let productId = req.params.id;

  let product = await Product.findOne({ _id: productId }).populate('owner');

  return res.status(200).json({
    product,
  });
});

exports.updateOwnProduct = catchAsyncErrors(async (req, res, next) => {
  let productId = req.params.id;

  let userId = req.user._id;

  let product = await Product.findOne({ _id: productId });

  if (!product) {
    return res.status(400).json({
      message: "Product doesn't exist.",
    });
  }

  let data = req.body;
  if (product.owner.toString() == userId.toString()) {
    product = await Product.findByIdAndUpdate(productId, data, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .json({ message: "Product updated successfully.", product });
  }
  if (product.owner !== userId) {
    return res
      .status(404)
      .json({ message: "You are not authorized to access this resource." });
  }
});

exports.deleteOwnProduct = catchAsyncErrors(async (req, res, next) => {
  let productId = req.params.id;

  let userId = req.user._id;

  let product = await Product.findOne({ _id: productId });

  if (!product) {
    return res.status(400).json({
      message: "Product doesn't exist.",
    });
  }

  if (product.owner.toString() == userId.toString()) {
    //delete product from user's database
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { products: productId } },
      { new: true }
    );

    //delete product
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: "Product deleted successfully." });
  }
  if (product.owner !== userId) {
    return res
      .status(404)
      .json({ message: "You are not authorized to access this resource." });
  }
});

exports.addProductToCart = catchAsyncErrors(async (req, res, next) => {
  let productFound = false;
  let userId = req.user.id;
  let productId = req.params.id;
  let product = await Product.findOne({ _id: productId });

  if (!product) {
    return res.status(400).json({
      message: "Product doesn't exist.",
    });
  }

  let user = await User.findOne({ _id: userId });

  //check if product already present in cart items and increase the quantity by 1
  user.cartItems.forEach(async (cartItem, index) => {
    if (cartItem.product.toString() == productId.toString()) {
      productFound = true;

      //check if the number of the item added in cart doesn't exceed the stock quantity.
      if (product.stock > user.cartItems[index].quantity) {
        user.cartItems[index].quantity += 1;
        await user.save();

        return res.status(200).json({
          message: "Product quantity increased by one.",
        });
      }
      if (product.stock <= user.cartItems[index].quantity) {
        return res.status(200).json({
          error:
            "Product quantity can't be increased as maximum stock reached.",
        });
      }
    }
  });

  //add product if not present
  if (!productFound) {
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $addToSet: {
          cartItems: {
            product: productId,
            quantity: 1,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Product added to cart.",
    });
  }
});

exports.addOrRemoveProductToWishlist = catchAsyncErrors(
  async (req, res, next) => {
    let productFound = false;
    let userId = req.user.id;
    let productId = req.params.id;
    let product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(400).json({
        message: "Product doesn't exist.",
      });
    }

    let user = await User.findOne({ _id: userId });

    //check if product already present in wishlist and then remove it
    user.wishlist.forEach(async (item, index) => {
      if (item.product.toString() == productId.toString()) {
        productFound = true;

        await User.findByIdAndUpdate(
          { _id: userId },
          { $pull: { wishlist: { product: product } } },
          { new: true }
        );

        return res.status(200).json({
          message: "Product removed from wishlist.",
        });
      }
    });

    //add product if not present
    if (!productFound) {
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            wishlist: {
              product: product,
            },
          },
        },
        { new: true }
      );
      return res.status(200).json({
        message: "Product added to wishlist.",
      });
    }
  }
);

//ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let productId = req.params.id;

  let product = await Product.findOne({ _id: productId });

  if (!product) {
    return res.status(400).json({
      message: "Product doesn't exist.",
    });
  }

  await Product.findOneAndDelete(productId);

  return res
    .status(200)
    .json({ message: "Product deleted by admin successfully." });
});
