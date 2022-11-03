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
