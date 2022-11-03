const express = require("express");

const Router = express.Router();

const productController = require("../controller/product");

Router.post("/create", productController.createProduct);
Router.get("/", productController.getAllProduct);
Router.get("/:productId", productController.getProductById);
Router.patch("/update/:productId", productController.updateProduct);
Router.delete("/delete/:productId", productController.deleteProduct);

module.exports = Router;
