const wrapper = require("../utils/wrapper");
const productModel = require("../models/product");

module.exports = {
  showGreetings: async (request, response) => {
    try {
      // return response.status(200).send("Hello World!");
      return wrapper.response(
        response,
        200,
        "Success Get Greetings",
        "Hello World !"
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
};
