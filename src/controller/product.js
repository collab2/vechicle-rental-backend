const wrapper = require("../utils/wrapper");
const productModel = require("../models/product");

module.exports = {
  createProduct: async (request, response) => {
    try {
      const {
        nameProduct,
        location,
        description,
        status,
        stock,
        price,
        category,
        capacity,
      } = request.body;

      const setData = {
        nameProduct,
        location,
        description,
        status,
        stock,
        price,
        category,
        capacity,
      };
      await productModel.createProduct(setData);
      //   console.log(result);
      return wrapper.response(response, 200, "Success Create Product", setData);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getAllProduct: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = +page || 1;
      limit = +limit || 5;

      const totalData = await productModel.getCountProduct();
      const totalPage = Math.ceil(totalData.rows / limit);
      const resultTotalData = totalData.rows[0].count;
      const pagination = {
        // page, totalPage, limit, totalData
        page,
        totalPage,
        limit,
        resultTotalData,
      };

      const offset = page * limit - limit;

      const result = await productModel.getAllProduct(limit, offset);
      return wrapper.response(
        response,
        200,
        "Success Get All Product",
        result.rows,
        pagination
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
  getProductById: async (request, response) => {
    try {
      const { productId } = request.params;

      const result = await productModel.getProductById(productId);

      return wrapper.response(
        response,
        200,
        "Success Get Product",
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
  updateProduct: async (request, response) => {
    try {
      const { productId } = request.params;

      // console.log(request.file);
      const {
        nameProduct,
        location,
        description,
        status,
        stock,
        price,
        category,
        capacity,
      } = request.body;

      await productModel.getProductById(productId);

      const setData = {
        nameProduct,
        location,
        description,
        status,
        stock,
        price,
        category,
        capacity,
      };

      await productModel.updateProduct(productId, setData);

      return wrapper.response(response, 200, "Success Update Data", setData);
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      // console.log(error);
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  deleteProduct: async (request, response) => {
    try {
      const { productId } = request.params;

      const checkId = await productModel.getCountProductById(productId);
      console.log(checkId);
      if (checkId.rows[0].count !== 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${productId} Not Found`,
          []
        );
      }
      await productModel.deleteProduct(productId);

      return wrapper.response(response, 200, "Success Delete Data", null);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
