const express = require("express");

const Router = express.Router();

const categoryController = require("../controller/category");
const authMiddleware = require("../middleware/auth");

Router.get("/", categoryController.getAllCategory);
Router.post(
  "/create",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  categoryController.createProduct
);
Router.get("/product", categoryController.getAllProductFromCategory);
Router.delete(
  "/delete/:categoryName",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  categoryController.deleteCategory
);
module.exports = Router;
