const connection = require("../config/postgresql");

module.exports = {
  createProduct: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO product (nameproduct, location, description, status, stock, price, category, capacity, image, "categoryId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          data.nameProduct,
          data.location,
          data.description,
          data.status,
          data.stock,
          data.price,
          data.category,
          data.capacity,
          data.image,
          data.categoryId,
        ],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getCountProduct: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(location) FROM product",
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getCountProductById: (productId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT("productId") FROM product WHERE "productId"= $1`,
        [productId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getAllProduct: (limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM product LIMIT $1 OFFSET $2",
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getProductById: (productId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM product WHERE "productId"=$1`,
        [productId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateProduct: (productId, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE product SET nameProduct=$1, location=$2, description=$3, status=$4, stock=$5, price=$6, category=$7, capacity=$8 WHERE "productId" = $8`,
        [
          data.nameProduct,
          data.location,
          data.description,
          data.status,
          data.stock,
          data.price,
          data.category,
          data.capacity,
          productId,
        ],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  deleteProduct: (productId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM product WHERE "productId"= $1`,
        [productId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
};
