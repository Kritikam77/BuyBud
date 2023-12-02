// models/User.js
const mongoose = require("mongoose");

const deletedUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Username is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  address: {
    houseNumber: {
      type: String,
      required: [true, "House Number is required."],
    },
    street: {
      type: String,
      required: [true, "Street is required."],
    },
    city: {
      type: String,
      required: [true, "City is required."],
    },
    state: {
      type: String,
      required: [true, "State is required."],
    },
    postalCode: {
      type: String,
      required: [true, "Postal Code is required."],
    },
    country: {
      type: String,
      required: [true, "Country is required."],
    },
  },
  avatar: {
    type: [String],
    // required: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone Number is required."],
  },
  products: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      price: {
        type: Number,
        
      },
      category: {
        type: String,
      },
      // imageUrls: {
      //   type: String,
      // },
      stock: {
        type: Number,
      },
      createdAt: {
        type: Date,
      },
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
  }
});


const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);

module.exports = DeletedUser;
