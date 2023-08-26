const express = require("express");
const router = express.Router();
const whishlistController = require("../controllers/whishlistController/whishlist");
const userAuth = require("../middleware/userUthentication");

router.post(
  "/add-product",
  userAuth.userAuthentication,
  whishlistController.addWhishlistProduct
);
router.post(
  "/remove-product",
  userAuth.userAuthentication,
  whishlistController.removeWhishlistedProduct
);

module.exports = router;
