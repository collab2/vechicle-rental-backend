const supabase = require("../config/supabase");

module.exports = {
  // showGreetings: () => new Promise((resolve, reject) => {}),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*")
        .eq("email", email)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getUserByUsername: (username) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*")
        .eq("username", username)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
