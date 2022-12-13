const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");
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
        categoryId,
      } = request.body;

      // const newArr = [];
      // console.log(request.files?.image2[0].filename);
      // request.files.forEach((elem) => newArr.push(elem.filename));
      // const image = newArr.join(", ") || [];

      console.log(request.files.image);
      const setData = {
        nameProduct,
        location,
        description,
        status,
        stock,
        price,
        category,
        capacity,
        image1: !request.files.image1 ? "" : request.files.image1[0].filename,
        image2: !request.files.image2 ? "" : request.files.image2[0].filename,
        image3: !request.files.image3 ? "" : request.files.image3[0].filename,
        categoryId,
      };

      console.log(setData);

      await productModel.createProduct(setData);
      //   console.log(result);
      return wrapper.response(response, 200, "Success Create Product", setData);
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
  getAllProduct: async (request, response) => {
    try {
      let { page, limit, sort, nameproduct, location, category } =
        request.query;
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

      console.log(totalData);

      const offset = page * limit - limit;

      const result = await productModel.getAllProduct(
        limit,
        offset,
        sort,
        category || "",
        nameproduct || "",
        location || ""
      );
      return wrapper.response(
        response,
        200,
        "Success Get All Product",
        result.rows,
        pagination
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
  getAllProductByCategory: async (req, res) => {
    try {
      const data = await productModel.getProductByCategory();
      const findTitles = (categories) => {
        const result = [];
        for (let i = 0; i < categories.length; i += 1) {
          const resultObj = {};
          resultObj.category = categories[i];
          resultObj.items = [];
          data.rows.forEach((val) => {
            if (val.categoryName.includes(categories[i])) {
              resultObj.items.push({
                productId: val.productId,
                createdAt: val.createdAt,
                nameProduct: val.nameProduct,
                location: val.location,
                description: val.description,
                status: val.status,
                image1: val.image1,
                price: val.price,
                category: val.category,
                capacity: val.capacity,
                categoryId: val.categoryId,
                image2: val.image2,
                image3: val.image3,
              });
            }
          });
          result.push(resultObj);
        }
        return result;
      };

      const resArr = [];
      data.rows.filter((item) => {
        const i = resArr.findIndex((x) => x.categoryName === item.categoryName);
        if (i <= -1) {
          resArr.push(item.categoryName);
        }
        return null;
      });

      const category = [...new Set(resArr)];

      return wrapper.response(
        res,
        200,
        "succes get product by category",
        findTitles(category)
      );
    } catch (error) {
      console.log(error);
    }
  },
  getProductById: async (request, response) => {
    try {
      const { productId } = request.params;

      const result = await productModel.getProductById(productId);
      console.log(result);

      // console.log(result.rows.slice(6, 7));
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

      const getDataProduct = await productModel.getProductById(productId);

      let setData = {};

      if (!request.files) {
        setData = {
          nameProduct: nameProduct || getDataProduct.rows[0].nameproduct,
          location: location || getDataProduct.rows[0].location,
          description: description || getDataProduct.rows[0].description,
          status: status || getDataProduct.rows[0].status,
          stock: stock || getDataProduct.rows[0].stock,
          image1: getDataProduct.rows[0].image1,
          image2: getDataProduct.rows[0].image2,
          image3: getDataProduct.rows[0].image3,
          price: price || getDataProduct.rows[0].price,
          category: category || getDataProduct.rows[0].category,
          capacity: capacity || getDataProduct.rows[0].capacity,
        };
      } else {
        setData = {
          nameProduct: nameProduct || getDataProduct.rows[0].nameproduct,
          location: location || getDataProduct.rows[0].location,
          description: description || getDataProduct.rows[0].description,
          status: status || getDataProduct.rows[0].status,
          stock: stock || getDataProduct.rows[0].stock,
          image1: request.files.image1
            ? request.files?.image1[0].filename
            : getDataProduct.rows[0].image1,
          image2: request.files.image2
            ? request.files?.image2[0].filename
            : getDataProduct.rows[0].image2,
          image3: request.files.image3
            ? request.files?.image3[0].filename
            : getDataProduct.rows[0].image3,
          price: price || getDataProduct.rows[0].price,
          category: category || getDataProduct.rows[0].category,
          capacity: capacity || getDataProduct.rows[0].capacity,
        };
      }

      if (getDataProduct.rows.length === 0) {
        return wrapper.response(response, 404, "product not found", []);
      }

      console.log(request.files);

      if (request.files?.image1) {
        cloudinary.uploader.destroy(
          getDataProduct?.rows[0]?.image1,
          (result) => {
            console.log(result);
          }
        );
      }
      if (request.files?.image2) {
        cloudinary.uploader.destroy(
          getDataProduct?.rows[0]?.image2,
          (result) => {
            console.log(result);
          }
        );
      }
      if (request.files?.image3) {
        cloudinary.uploader.destroy(
          getDataProduct?.rows[0]?.image3,
          (result) => {
            console.log(result);
          }
        );
      }

      await productModel.updateProduct(productId, setData);
      return wrapper.response(response, 200, "success update date", setData);
      // const event = await productModel.updateProduct(productId, setData);
      // return wrapper.response(response, event.status, "succes s updated", {
      //   ...event.data[0],
      //   setData,
      // });
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
  deleteImage: async (req, res) => {
    try {
      const { productId } = req.params;
      // console.log(req.body.image1);
      const getProductData = await productModel.getProductById(productId);
      // console.log(getProductData.rows[0]);
      if (req.body.image1) {
        cloudinary.uploader.destroy(
          getProductData?.rows[0]?.image1,
          (result) => {
            // console.log(result);
          }
        );
      }
      if (req.body.image2) {
        cloudinary.uploader.destroy(
          getProductData?.rows[0]?.image2,
          (result) => {
            // console.log(result);
          }
        );
      }
      if (req.body.image3) {
        cloudinary.uploader.destroy(
          getProductData?.rows[0]?.image3,
          (result) => {
            // console.log(result);
          }
        );
      }
      console.log("test", req.body);
      await productModel.deleteImageProduct(req.body);
      return wrapper.response(res, 200, "success delete image", null);
    } catch (error) {
      console.log(error);
    }
  },
  getProduct: async (request, response) => {
    try {
      const result = await productModel.getProduct();

      return wrapper.response(
        response,
        200,
        "Success Get Greetings",
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
};
