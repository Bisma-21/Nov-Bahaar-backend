const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController/product");

router.get("/delete-all", productController.deleteAllProducts);

router.post("/create", productController.createProduct);

router.get("/all", productController.getAllProducts);

router.get("/delete/:productId", productController.deleteProductById);

router.get("/:productId", productController.productById);

module.exports = router;
