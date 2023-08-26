const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController/review");
const userAuth = require("../middleware/userUthentication");

router.get("/:productId", reviewController.getReviewsOfAProduct);

router.post(
  "/create/:productId",
  userAuth.userAuthentication,
  reviewController.createReviewOfAProduct
);
router.post(
  "/update/:reviewId",
  userAuth.userAuthentication,
  reviewController.updateReviewOfAProduct
);
module.exports = router;
