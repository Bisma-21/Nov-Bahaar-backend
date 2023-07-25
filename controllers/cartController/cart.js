const Cart = require("../../models/cart");
const Product = require("../../models/product");

exports.addToCart = async (req, res) => {
  try {
    console.log("888888888888888888");
    const userId = req?.userId;
    // console.log("userid==================>", userId);
    const productId = req.body.productId;
    console.log({ productId });
    // const userId = "646755f4a069eff51aba1c05";
    // const productId = "646736f028da9855eb6b6517";
    const checkProduct = await Product.findById(productId);
    console.log("8888888", checkProduct);
    // if (checkProduct) {
    //   return res.status(400).json({
    //     message: "Product is Already In a Cart.",
    //   });
    // }
    const checkAlreadyCartExist = await Cart.findOne({ userId });
    if (!checkProduct) {
      return res.status(400).json({
        message: "Product Not Found!.",
      });
    }
    console.log("ccccccccccc", checkAlreadyCartExist);

    const checkProductInACart = checkAlreadyCartExist?.products.find(
      (e) => e.pId == productId
    );
    if (checkProductInACart) {
      return res.status(400).json({
        message: "Product is Already In a Cart.",
      });
    }
    const body = {
      userId,
      products: [
        {
          pId: productId,
          quantity: 1,
        },
      ],
      total: checkProduct.price,
    };
    console.log({ body });
    let createCart = {};
    if (!checkAlreadyCartExist) {
      createCart = await Cart.create(body);
    } else {
      checkAlreadyCartExist.products.push({
        pId: productId,
        quantity: 1,
      });
      //   console.log("vvvvv===", checkAlreadyCartExist);
      await Cart.updateOne({ userId }, checkAlreadyCartExist);
    }
    const updatedCart = await Cart.findOne({ userId })
      .populate("products.pId")
      .exec();
    console.log({ updatedCart });
    // console.log("yyyyyyyyyyyyy", y);
    res.status(200).json({
      message: "Successfully Add To Cart!.",
      response: updatedCart,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.getMyCart = async (req, res) => {
  try {
    const userId = req.userId;
    // const userId = "646755f4a069eff51aba1c05";
    const checkCart = await Cart.findOne({ userId })
      .populate("products.pId")
      .exec();
    console.log({ checkCart });
    if (!checkCart) {
      return res.status(400).json({
        message: "No Products Found!.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched single product.",
      response: checkCart,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.removeProductfromCart = async (req, res) => {
  try {
    // const userId = "64672bf570cd51e2c555efe6";
    // const productId = "64671602cd7b8d5aaa846834";
    const userId = req.userId;
    console.log({ userId });
    const productId = req.body.productId;
    const cart = await Cart.findOne({ userId });
    console.log("cccccccc", cart);
    // if (!cart) {
    //   return res.status(400).json({
    //     message: "No User Exists in Cart!.",
    //   });
    // }
    const u = cart.products;
    console.log("uuuuuuuuu", u);
    const remainingProducts = u.filter((e) => e.pId != productId);
    console.log("qqqqq", remainingProducts);
    cart.products = [...remainingProducts];
    console.log("cart====", cart);
    await cart.save(); // ist method
    // const r = await Cart.updateOne({ userId }, { products: remainingProducts }); //2nd method
    const updatedCart = await Cart.findOne({ userId })
      .populate("products.pId")
      .exec();
    console.log("yyy", updatedCart);
    res.status(200).json({
      message: "Product Removed From Cart Successfully!.",
      response: updatedCart,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

exports.quantityIncreaseOfAProduct = async (req, res) => {
  try {
    console.log("inside icrement");
    // const userId = "646755f4a069eff51aba1c05";
    // const productId = "646736f028da9855eb6b6517";
    const userId = req.userId;
    console.log({ userId });
    const productId = req.body.pId;
    console.log({ productId });
    const findUserInCart = await Cart.findOne({ userId });

    console.log("777", findUserInCart);
    if (!findUserInCart) {
      return res.status(400).json({
        message: "User Not Found In A Cart!.",
      });
    }
    const findProductInACart = findUserInCart.products;
    const matchedProduct = findProductInACart.filter((e) => e.pId == productId);
    const unMatchedProducts = findProductInACart.filter(
      (e) => e.pId != productId
    );
    console.log("9999", matchedProduct);
    const incrementedProductQuantity = matchedProduct.map((e) => {
      return {
        pId: e.pId,
        quantity: e.quantity + 1,
        _id: e._id,
      };
    });
    console.log("8888", incrementedProductQuantity);
    const finalArray = unMatchedProducts.concat(incrementedProductQuantity);
    console.log("rrrrrrrrrrr", finalArray);
    await Cart.updateOne({ userId }, { products: finalArray });
    const updatedCart = await Cart.findOne({ userId })
      .populate("products.pId")
      .exec();
    res.status(200).json({
      message: "Qunatity Increased Successfully!.",
      message: updatedCart,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error.",
    });
  }
};

exports.quantityDecrementOfAProduct = async (req, res) => {
  try {
    // const userId = "646755f4a069eff51aba1c05";
    // const productId = "646736f028da9855eb6b6517";
    const userId = req.userId;
    console.log({ userId });
    const productId = req.body.pId;
    console.log({ productId });
    const checkUserInACart = await Cart.findOne({ userId });
    if (!checkUserInACart) {
      return res.status(400).json({
        message: "User not Found In A Cart!.",
      });
    }
    const matchedProductArray = checkUserInACart.products.filter(
      (e) => e.pId == productId
    );

    const unMatchedProductArray = checkUserInACart.products.filter(
      (e) => e.pId != productId
    );
    const decrementedProductQuantity = matchedProductArray.map((e) => {
      return {
        pId: e.pId,
        quantity: e.quantity - 1,
        _id: e._id,
      };
    });
    const finalProductArray = decrementedProductQuantity.concat(
      unMatchedProductArray
    );
    await Cart.updateOne({ userId }, { products: finalProductArray });

    const updatedCarts = await Cart.findOne({ userId })
      .populate("products.pId")
      .exec();
    res.status(200).json({
      message: "Product Quantity Decreased Successfully!.",
      response: updatedCarts,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};
