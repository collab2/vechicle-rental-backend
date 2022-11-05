const express = require("express");

const Router = express.Router();

const productController = require("../controller/product");
const uploadMiddleware = require("../middleware/uploadFile");

Router.post(
  "/create",
  uploadMiddleware.uploadProduct,
  productController.createProduct
);
Router.get("/", productController.getAllProduct);
Router.get("/:productId", productController.getProductById);
Router.patch(
  "/update/:productId",
  uploadMiddleware.uploadProduct,
  productController.updateProduct
);
Router.delete("/delete/:productId", productController.deleteProduct);

module.exports = Router;
