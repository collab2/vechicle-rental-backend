const connection = require("../config/postgresql");

module.exports = {
  createProduct: (data) =>
    new Promise((resolve, reject) => {
      console.log(data);
      connection.query(
        `INSERT INTO product (nameproduct, location, description, status, stock, price, category, capacity, image1, image2, image3, "categoryId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          data.nameProduct,
          data.location,
          data.description,
          data.status,
          data.stock,
          data.price,
          data.category,
          data.capacity,
          data.image1,
          data.image2,
          data.image3,
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
  getAllProduct: (limit, offset, sort, category, nameproduct, location) =>
    new Promise((resolve, reject) => {
      if (!sort) {
        connection.query(
          `SELECT * FROM product where product.location ilike '%${location}%' and product.nameproduct ilike '%${nameproduct}%' and product.category ilike '%${category}%' limit ${limit} offset ${offset}`,
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(new Error(error));
            }
          }
        );
      } else if (sort === "latest") {
        connection.query(
          `SELECT * FROM product where product.location ilike '%${location}%' and product.nameproduct  ilike '%${nameproduct}%' and product.category ilike '%${category}%' order by  "createdAt" ASC limit ${limit} offset ${offset}`,

          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(new Error(error));
            }
          }
        );
      } else if (sort === "newest") {
        connection.query(
          `SELECT * FROM product where product.location ilike '%${location}%' and product.nameproduct  ilike '%${nameproduct}%' and product.category ilike '%${category}%' order by  "createdAt" DESC limit ${limit} offset ${offset}`,

          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(new Error(error));
            }
          }
        );
      }
    }),
  getProductByCategory: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT *
        FROM product
        JOIN category ON product."categoryId"=category."categoryId"`,
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
        `UPDATE product SET nameProduct=$1, location=$2, description=$3, status=$4, stock=$5, price=$6, category=$7, capacity=$8, image1=$9, image2=$10, image3=$11 WHERE "productId" = $12`,
        [
          data.nameProduct,
          data.location,
          data.description,
          data.status,
          data.stock,
          data.price,
          data.category,
          data.capacity,
          data.image1,
          data.image2,
          data.image3,
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
  deleteImageProduct: (data) =>
    new Promise((resolve, reject) => {
      console.log("ini data", data);
      connection.query(
        `UPDATE product
        SET ${Object.keys(data)[0]} = NULL
      WHERE ${Object.keys(data)[0]}=$1`,
        [data[Object.keys(data)[0]]],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getProduct: () =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM product`, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    }),
};
