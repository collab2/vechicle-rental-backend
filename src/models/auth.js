const connection = require("../config/postgresql");

module.exports = {
  // showGreetings: () => new Promise((resolve, reject) => {}),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE "email" = $1`,
        [email],
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
