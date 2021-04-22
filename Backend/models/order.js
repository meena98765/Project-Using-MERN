const mongoose = require("mongoose");

let OrderSchema = new mongoose.Schema(
  {
    customerID: {
      type: String,
      required: true,
      trim: true
    },

    productID: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      trim: true
    },

    isReviewed: {
      type: Boolean,
      default: false
    },

    isRated: {
      type: Boolean,
      default: false
    },

    productRating: {
      type: Number
    },

    productReview: {
      type: String
    }
  },

  {
    collection: "orders"
  }
);

module.exports = mongoose.model("Order", OrderSchema);
