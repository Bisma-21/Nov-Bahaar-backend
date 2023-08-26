const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalAmount: {
      type: Number,
    },
    products: [
      {
        pId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
      },
    ],
    address: {
      pincode: {
        type: String,
      },
      country: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveryStatus: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "INTRANSIT", "OUTFORDELIVERY", "DELIVERED"],
      default: "PLACED",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "GPAY", "PHONEPE", "PAYTM", "WALLET", "CARD"],
      default: "COD",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
