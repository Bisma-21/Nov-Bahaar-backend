const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController/user");
const userAuth = require("../middleware/userUthentication");
router.post("/signup", userController.signUpUser);
router.post("/login", userController.logInUser);
router.get(
  "/auto-login",
  userAuth.userAuthentication,
  userController.userAutoLogin
);
module.exports = router;
