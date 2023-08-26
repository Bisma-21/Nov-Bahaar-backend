const User = require("../../models/user");
const Product = require("../../models/product");

exports.addWhishlistProduct = async (req, res) => {
  try {
    const userId = req?.userId;
    const productId = req?.body?.productId;
    const checkProduct = await Product.findById(productId);
    console.log({ checkProduct });
    const id = checkProduct._id;
    const user = await User.findById(userId);
    console.log({ user });
    // user.saveProducts = [];
    // await user.save();
    const savedProduct = user.saveProducts.filter((e) => e.pId == productId);
    console.log({ savedProduct });
    if (savedProduct.length) {
      return res.status(400).json({
        message: "This Product Is already in whishlist",
      });
    }
    user.saveProducts.push({ pId: id });
    console.log({ user });
    await user.save();
    const updatedUser = await User.findById(userId)
      .populate("saveProducts.pId")
      .exec();
    console.log("whishlist===", updatedUser.saveProducts);

    res.status(200).json({
      message: "Saved Product Successfully!.",
      response: updatedUser,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.removeWhishlistedProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.body.productId;
    console.log({ productId });
    const user = await User.findById(userId);
    const data = user.saveProducts;
    console.log({ data });
    const index = user.saveProducts.findIndex((e) => e.pId == productId);
    // const checkProduct = user.saveProducts.filter(
    //   (e) => e.pId._id == productId
    // );
    if (index <= -1) {
      return res.status(400).json({
        message: "This Product is not in whishlist!.",
      });
    }
    data.splice(index, 1);
    console.log({ data });
    await user.save();
    console.log("jj");
    const updatedProducts = await User.findById(userId)
      .populate("saveProducts.pId")
      .exec();
    console.log("remove===", updatedProducts.saveProducts);
    res.status(200).json({
      response: updatedProducts,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};
