const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController/order");
const userAuth = require("../middleware/userUthentication");
router.post(
  "/create",
  userAuth.userAuthentication,
  orderController.createOrder
);
router.post(
  "/create-payment",
  // userAuth.userAuthentication,
  orderController.createPayment
);
router.post(
  "/verify-payment",
  // userAuth.userAuthentication,
  orderController.verifyPayment
);

router.get(
  "/all",
  userAuth.userAuthentication,
  orderController.getAllOrdersOfAUser
);
router.get("/:orderId", orderController.getOrderById);
module.exports = router;
