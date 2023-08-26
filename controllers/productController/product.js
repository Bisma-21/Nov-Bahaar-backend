const Product = require("../../models/product");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
exports.createProduct = async (req, res) => {
  try {
    // console.log("fillllll", req.files);
    const images = req.files;
    let path = "";
    let imageDetail = [];
    for (let i = 0; i < images.length; i++) {
      console.log("isttt prinst", images[i].path);
      if (images[i].path) {
        path = images[i].path;
        const values = await cloudinary.uploader.upload(`${path}`);
        imageDetail.push(values);
      }
    }
    console.log("qqqqqq", imageDetail);
    const imagePath = imageDetail.map((e) => e.url);
    // console.log("yyyyyyyyyyy", imagePath);
    const body = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      images: imagePath,
    };
    // console.log("body====>", body);
    const createProduct = await Product.create(body);
    console.log({ createProduct });
    res.status(200).json({
      message: "Product Created Successfully.",
      response: createProduct,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.title) {
      filter.title = { $regex: new RegExp(req.query.title, "i") };
    }
    const allProducts = await Product.find(filter);
    const productCount = await Product.count(filter);
    res.status(200).json({
      message: "All Products Fetched Successfully!.",
      response: { allProducts, productCount },
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error.",
    });
  }
};

exports.productById = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log({ productId });
    const checkProduct = await Product.findById(productId);
    console.log({ checkProduct });
    if (!checkProduct) {
      return res.status(400).json({
        message: "Product not found!.",
      });
    }
    res.status(200).json({
      message: "Successfully fetched single product",
      response: checkProduct,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    console.log("inside remove all produvt");
    const allProducts = await Product.find();
    console.log({ allProducts });
    await Product.deleteMany();
    // allProducts.save();
    // await Product.updateOne
    const products = await Product.find();
    console.log({ products });
    res.status(200).json({
      message: "All Products Deleted Successfully!.",
      response: products,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log({ productId });
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        message: "No Product Found!.",
      });
    }
    const y = await Product.deleteOne({ productId });
    console.log("yyyyyyyyyyyyy", y);
    // await product.save();
    await Product.updateOne({ productId });
    const updatedProducts = await Product.find();
    res.status(200).json({
      message: "Product By Id Deleted Successfully!.",
      response: updatedProducts,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.title) {
      filter.title = { $regex: new RegExp(req.query.title, "i") };
    }
    const data = await Product.find(filter);
    console.log({ data });
    res.status(200).json({
      message: "product fetched successfully!.",
      response: data,
    });
  } catch (error) {
    console.log(error);
  }
};
