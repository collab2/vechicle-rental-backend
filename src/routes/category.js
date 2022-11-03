const express = require("express");

const Router = express.Router();

const categoryController = require("../controller/category");

Router.get("/", categoryController.getAllCategory);
Router.post("/create", categoryController.createProduct);
Router.delete("/delete/:categoryName", categoryController.deleteCategory);
module.exports = Router;
