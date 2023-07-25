const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController/order");
const userAuth = require("../middleware/userUthentication");
router.post(
  "/create",
  userAuth.userAuthentication,
  orderController.createOrder
);

router.get(
  "/all",
  userAuth.userAuthentication,
  orderController.getAllOrdersOfAUser
);
router.get("/:orderId", orderController.getOrderById);
module.exports = router;
