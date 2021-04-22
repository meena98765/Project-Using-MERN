const mongoose = require("mongoose");

let ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      trim: true
    },

    quantityRemaining: {
      type: Number,
      required: true,
      trim: true
    },

    sellerID: {
      type: String,
      required: true,
      trim: true
    },

    isCancelled: {
      type: Boolean,
      default: false,
      trim: true
    },

    isReady: {
      type: Boolean,
      default: false,
      trim: true
    },

    hasDispatched: {
      type: Boolean,
      default: false,
      trim: true
    }
  },

  {
    collection: "products"
  }
);

module.exports = mongoose.model("Product", ProductSchema);
