const connection = require("../config/postgresql");

module.exports = {
  getAllProduct: (limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        // `SELECT * FROM product LIMIT ${limit} OFFSET ${offset}`, SELECT * FROM product LIMIT 5 OFFSET 0; DROP TABLE product;
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

  createProduct: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO product (nameProduct, location, description, status, stock, price, category, capacity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          data.nameProduct,
          data.location,
          data.description,
          data.status,
          data.stock,
          data.price,
          data.category,
          data.capacity,
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
};
