const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController/cart");
const userAuthenticationMiddleware = require("../middleware/userUthentication");
router.post(
  "/to-add",
  userAuthenticationMiddleware.userAuthentication,
  cartController.addToCart
);
router.get(
  "/my",
  userAuthenticationMiddleware.userAuthentication,
  cartController.getMyCart
);
router.post(
  "/remove-item",
  userAuthenticationMiddleware.userAuthentication,
  cartController.removeProductfromCart
);
router.post(
  "/increase-quantity",
  userAuthenticationMiddleware.userAuthentication,
  cartController.quantityIncreaseOfAProduct
);
router.post(
  "/decrease-quantity",
  userAuthenticationMiddleware.userAuthentication,
  cartController.quantityDecrementOfAProduct
);
module.exports = router;
