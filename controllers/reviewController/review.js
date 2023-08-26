const User = require("../../models/user");
const Product = require("../../models/product");
const Review = require("../../models/reviews");
const Order = require("../../models/order");

//rating of a single product (single user)

exports.getReviewsOfAProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log({ productId });
    const checkProduct = await Review.find({ productId })
      .populate("userId")
      .exec();
    console.log({ checkProduct });
    if (!checkProduct) {
      return res.status(400).json({
        message: "Product is not found!.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched rating oa a product!.",
      response: checkProduct,
    });
  } catch (error) {
    console.log({ error });
  }
};

exports.createReviewOfAProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const checkProduct = await Product.find({ productId });
    if (!checkProduct) {
      return res.status(400).json({
        message: "product doesn't Found!.",
      });
    }
    const body = {
      comment: req.body.comment,
      rating: req.body.rating,
      userId,
      productId,
    };
    const checkOrderedProduct = await Order.findOne({
      userId: userId,
      products: {
        $elemMatch: {
          pId: productId,
        },
      },
    });
    if (!checkOrderedProduct) {
      return res.status(400).json({
        message: "You are not Eligible to commit",
      });
    }
    console.log("bole if");
    const createReview = await Review.create(body);
    const createdReview = await Review.find(createReview._id)
      .populate("userId")
      .populate("productId")
      .exec();
    // console.log({ createdReview });

    // console.log({ checkOrderedProduct });
    res.status(200).json({
      message: "review for a product created Successfully",
      response: createdReview,
    });
  } catch (error) {
    console.log({ error });
  }
};

exports.updateReviewOfAProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const reviewId = req.params.reviewId;
    const checkProductInReview = await Review.findById(reviewId);
    if (!checkProductInReview) {
      return res.status(400).json({
        message: "Product Not Found!.",
      });
    }
    const body = {
      comment: req.body.comment,
      rating: req.body.rating,
    };
    const r = await Review.updateOne(
      { _id: reviewId },
      { comment: body.comment, rating: body.rating }
    );
    console.log({ r });
    const updatedReview = await Review.findById(reviewId);
    res.status(200).json({
      message: "Update Review Successfully!.",
      response: updatedReview,
    });
  } catch (error) {
    console.log({ error });
  }
};
