const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    saveProducts: [
      {
        pId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],

    // saveProductIds: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product",
    //   },
    // ], // [array of strings]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
