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
        `SELECT "userId", "createdAt", "updatedAt", "role", "name", "email", "address", "phone", "gender", "birthDate", "image" FROM users WHERE "userId" = $1`,
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
  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET "name" = $1, "address" = $2, "phone" = $3, "gender" = $4, "birthDate" = $5, "image" = $6 WHERE "userId" = $7`,
        [
          data.name,
          data.address,
          data.phone,
          data.gender,
          data.birthDate,
          data.image,
          id,
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
  getPasswordById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT password FROM users WHERE "userId" = '${id}'`,

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

// };
