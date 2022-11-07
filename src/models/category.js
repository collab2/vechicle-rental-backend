const connection = require("../config/postgresql");

module.exports = {
  createCategory: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO category ("categoryName") VALUES ('${data.categoryName}')`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getAllCategory: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT "categoryName" FROM category`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getProductFromCategory: (category, searchName, location) =>
    new Promise((resolve, reject) => {
      if (!category) {
        connection.query(
          `SELECT * from product join category on (category."categoryId" = product."categoryId")`,
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(new Error(error));
            }
          }
        );
      } else {
        connection.query(
          `SELECT * from product JOIN category on (category."categoryId" = product."categoryId") WHERE category."categoryName" = '${category}' AND product.location ilike '%${
            location || ""
          }%' AND product.nameproduct ilike '%${searchName || ""}%'`,
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              console.log(error);
              reject(new Error(error));
            }
          }
        );
      }
    }),
  getCategoryByName: (name) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT "categoryName" FROM category WHERE "categoryName"='${name}'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  deleteCategory: (name) =>
    new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM category WHERE "categoryName"= '${name}'`,
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
