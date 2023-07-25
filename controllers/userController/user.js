const User = require("../../models/user");
const Cart = require("../../models/cart");
const Order = require("../../models/order");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUpUser = async (req, res) => {
  try {
    console.log("7777777777");
    const salt = await bcrypt.genSalt(+process.env.SaltRound);
    console.log("round===", salt);
    const body = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
    };
    console.log("bodyyy==", body);
    const createUser = await User.create(body);
    res.status(200).json({
      message: "User Created Successfully!.",
      response: createUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messsage: "Internal Server Error.",
    });
  }
};

exports.logInUser = async (req, res) => {
  try {
    // const userSecretKey = "USERSECRETKEY";
    const userSecretKey = process.env.UserSecretKey;
    // console;
    const email = req.body.email;
    const password = req.body.password;
    const checkUser = await User.findOne({ email });
    const userId = checkUser._id;
    console.log("checkuser===", checkUser);
    if (!checkUser) {
      return res.status(400).json({
        message: "User With This Email not found!.",
      });
    }
    const userPassword = checkUser?.password;
    const comparedPassword = await bcrypt.compare(password, userPassword);
    if (!comparedPassword) {
      return res.status(400).json({
        message: "Password is In-correct!.",
      });
    }

    const token = jsonwebtoken.sign({ email, userId }, userSecretKey);
    res.status(200).json({
      message: "User Logged In Successfully.",
      response: { checkUser, token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.userAutoLogin = async (req, res) => {
  try {
    // console.log("999999999999999999999999");
    const userId = req.userId;
    // console.log("xxxxxxxxxxxxx", userId);
    // if (userId == "undefined") {
    //   return res.status(400).json({
    //     message: "User Should Be login First!.",
    //   });
    // }
    const users = await User.findById(userId)
      .populate("saveProducts.pId")
      .exec();
    if (!users) {
      return res.status(400).json({
        message: "User Not Found!.",
      });
    }
    const cart = await Cart.findOne({ userId }).populate("products.pId").exec();
    res.status(200).json({
      message: "User  Found Successfully!.",
      response: { users, cart },
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};
//cart
//product

//order
