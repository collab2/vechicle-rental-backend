const wrapper = require("../utils/wrapper");
const categoryModel = require("../models/category");

module.exports = {
  createProduct: async (request, response) => {
    try {
      const { categoryName } = request.body;

      const setData = {
        categoryName,
      };
      const checkCategory = await categoryModel.getCategoryByName(categoryName);

      if (checkCategory.rows.length === 1) {
        return wrapper.response(
          response,
          404,
          `${categoryName} Category is Already Registered`,
          []
        );
      }

      const result = await categoryModel.createCategory(setData);
      console.log(result);
      return wrapper.response(
        response,
        200,
        "Success Create Category",
        setData
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },

  getAllCategory: async (request, response) => {
    try {
      const result = await categoryModel.getAllCategory();
      const data = result.rows.map((item) => item.categoryName);
      return wrapper.response(response, 200, "Success Get Category", data);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getAllProductFromCategory: async (request, response) => {
    const { category, searchName, location } = request.query;
    try {
      const result = await categoryModel.getProductFromCategory(
        category,
        searchName,
        location
      );
      const data = result.rows.map((item) => item.categoryName);
      // console.log(data);
      return wrapper.response(
        response,
        200,
        "Success Get Category",
        result.rows
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  deleteCategory: async (request, response) => {
    try {
      const { categoryName } = request.params;

      const checkCategory = await categoryModel.getCategoryByName(categoryName);

      if (checkCategory.rows.length === 0) {
        return wrapper.response(
          response,
          404,
          `${categoryName} Category Not Found`,
          []
        );
      }
      await categoryModel.deleteCategory(categoryName);

      return wrapper.response(response, 200, "Success Delete Data", null);
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
