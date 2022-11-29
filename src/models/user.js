const connection = require("../config/postgresql");

module.exports = {
  getAllData: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM users;", (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    }),
  getDataById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE "userId" = $1`,
        [id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  createUser: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [data.email, data.password],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateUser: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET password= $1 WHERE "userId" = $2`,
        [data.password, id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateStatusActive: (id, data) =>
    new Promise((resolve, reject) => {
      console.log(id, data);
      connection.query(
        `UPDATE users SET "statusActive"= $1 WHERE "userId" = $2`,
        [data.statusActive, id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  //   deleteUser: (id) =>
  //     new Promise((resolve, reject) => {
  //       supabase
  //         .from("user")
  //         .delete()
  //         .eq("userId", id)
  //         .select(
  //           "userId, name, gender, profession, nationality, dateOfBirth, phoneNumber, role, createdAt, updatedAt"
  //         )
  //         .then((result) => {
  //           if (!result.error) {
  //             resolve(result);
  //           } else {
  //             reject(result);
  //           }
  //         });
  //     }),
  //   getCountUser: () =>
  //     new Promise((resolve, reject) => {
  //       supabase
  //         .from("user")
  //         .select("*", { count: "exact" })
  //         .then((result) => {
  //           if (!result.error) {
  //             resolve(result.count);
  //           } else {
  //             reject(result);
  //           }
  //         });
  //     }),
};
